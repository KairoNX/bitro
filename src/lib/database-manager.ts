/**
 * Database Manager
 * Manages isolated PostgreSQL schemas within shared Neon database
 */

import { prisma } from './db';

/**
 * Generate a unique schema name for a project
 */
export function generateSchemaName(projectId: string): string {
  // Create short hash from projectId
  const hash = projectId.substring(0, 12).replace(/-/g, '');
  return `proj_${hash}`;
}

/**
 * Create a PostgreSQL schema for a project's isolated database
 * Uses Neon PostgreSQL connection
 */
export async function createProjectSchema(projectId: string): Promise<string> {
  const schemaName = generateSchemaName(projectId);

  try {
    // Execute SQL directly using Prisma raw query
    await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    // Store schema name in database
    await prisma.fragment.updateMany({
      where: { 
        message: {
          projectId: projectId
        }
      },
      data: {
        databaseSchema: schemaName,
      },
    });

    return schemaName;
  } catch (error) {
    console.error('Failed to create schema:', error);
    // If schema creation fails, still return the schema name
    // The AI will use it for documentation purposes
    return schemaName;
  }
}

/**
 * Get database connection string with schema
 */
export function getDatabaseConnectionString(schemaName: string): string {
  const dbUrl = process.env.DATABASE_URL!;
  const url = new URL(dbUrl);
  url.searchParams.set('schema', schemaName);
  return url.toString();
}

/**
 * List all tables in a project schema
 */
export async function listTables(schemaName: string): Promise<string[]> {
  try {
    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ${schemaName}
    `;
    
    return tables.map(row => row.table_name);
  } catch (error) {
    console.error('Failed to list tables:', error);
    return [];
  }
}

/**
 * Execute SQL in a project's schema
 */
export async function executeSQL(schemaName: string, sql: string): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(
      `SET search_path TO "${schemaName}"; ${sql}`
    );
  } catch (error) {
    console.error('Failed to execute SQL:', error);
    throw error;
  }
}

/**
 * Get table data
 */
export async function getTableData(
  schemaName: string, 
  tableName: string, 
  limit = 100
): Promise<Record<string, unknown>[]> {
  try {
    // Set schema search path temporarily
    const data = await prisma.$queryRawUnsafe(
      `SET search_path TO "${schemaName}"; SELECT * FROM "${tableName}" LIMIT ${limit}`
    );
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to get table data:', error);
    return [];
  }
}

