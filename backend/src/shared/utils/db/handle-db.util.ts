import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, QueryFailedError, UpdateResult } from 'typeorm';

/**
 * Handles DB operations with unified error handling for common cases:
 * - Throws ConflictException on unique constraint violation.
 * - Re-throws NotFound or Conflict exceptions.
 * - Converts other errors to InternalServerErrorException.
 * Optionally ensures affected rows (for update/delete).
 */
export async function handleDb<T>(
  operation: () => Promise<T>,
  options?: { requireAffected?: boolean },
): Promise<T> {
  let result: T;

  try {
    result = await operation();
  } catch (error: unknown) {
    if (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string })?.code === 'ER_DUP_ENTRY'
    ) {
      throw new ConflictException(
        'This phone number is already in use. Please enter a different one.',
      );
    }

    if (
      error instanceof NotFoundException ||
      error instanceof ConflictException
    ) {
      throw error;
    }

    throw new InternalServerErrorException(
      `An unexpected error occurred during database operation.`,
    );
  }

  if (options?.requireAffected) {
    if (isResultWithAffected(result) && (result.affected ?? 0) === 0) {
      throw new NotFoundException(
        `Entity not found for delete/update operation.`,
      );
    }
  }

  return result;
}

function isResultWithAffected(
  result: unknown,
): result is DeleteResult | UpdateResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    'affected' in result &&
    typeof (result as { affected?: unknown }).affected === 'number'
  );
}
