import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/lib/db";
import { listTables, getTableData } from "@/lib/database-manager";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";

export const cloudRouter = createTRPCRouter({
  getDatabaseInfo: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      // Get the project to verify ownership
      const project = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId,
        },
      });

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      // Get the latest fragment with schema info
      const latestMessage = await prisma.message.findFirst({
        where: {
          projectId: input.projectId,
          fragment: {
            isNot: null,
          },
        },
        include: {
          fragment: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!latestMessage?.fragment?.databaseSchema) {
        return {
          hasDatabase: false,
          schema: null,
          tables: [],
        };
      }

      const schemaName = latestMessage.fragment.databaseSchema;
      const tables = await listTables(schemaName);

      return {
        hasDatabase: true,
        schema: schemaName,
        tables,
      };
    }),

  getTableData: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        tableName: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      // Verify project ownership
      const project = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId,
        },
      });

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      // Get schema name
      const latestMessage = await prisma.message.findFirst({
        where: {
          projectId: input.projectId,
          fragment: {
            isNot: null,
          },
        },
        include: {
          fragment: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!latestMessage?.fragment?.databaseSchema) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No database found" });
      }

      const schemaName = latestMessage.fragment.databaseSchema;
      const data = await getTableData(schemaName, input.tableName);

      return {
        data,
        count: data.length,
      };
    }),

  getEnvironmentVariables: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      // Verify ownership
      const project = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId,
        },
      });

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      // Get environment variables
      const envVars = await prisma.projectEnvironment.findMany({
        where: {
          projectId: input.projectId,
        },
        select: {
          id: true,
          key: true,
          isSecret: true,
          createdAt: true,
          // Don't return value for security
        },
      });

      return envVars;
    }),
});

