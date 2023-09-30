import type { UserProfile } from '@prisma/client'
import { db } from '~/database.server'

// CREATE

/**
 * Saves a new user profile to the database.
 *
 * @param user profile - Parameters of the user profile that should be created.
 * @returns The newly created user profile.
 */
export async function saveUserProfileToDatabase(userProfile: Pick<Parameters<typeof db.userProfile.create>[0]['data'], 'email' | 'id' | 'name'>) {
  return db.userProfile.create({ data: userProfile })
}

// READ

/**
 * Retrieves a user profile record from the database based on its id.
 *
 * @param id - The id of the user profile to get.
 * @returns The user profile with a given id or null if it wasn't found.
 */
export async function retrieveUserProfileFromDatabaseById(id: UserProfile['id']) {
  return db.userProfile.findUnique({ where: { id } })
}

// UPDATE

/**
 *  Updates a user profile in the database.
 *
 * @param options - A an object with the user profile's id and the new values.
 * @returns The updated user profile.
 */
export async function updateUserProfileInDatabaseById({
  id,
  userProfile,
}: {
  /**
   * The id of the user profile you want to update.
   */
  id: UserProfile['id']
  /**
   * The values of the user profile you want to change.
   */
  userProfile: Partial<Pick<Parameters<typeof db.userProfile.update>[0]['data'], 'email' | 'name'>>
}) {
  return db.userProfile.update({ where: { id }, data: userProfile })
}

// DELETE

/**
 * Removes a user profile from the database.
 *
 * @param id - The id of the user profile you want to delete.
 * @returns The user profile that was deleted.
 */
export async function deleteUserProfileFromDatabaseById(id: UserProfile['id']) {
  return db.userProfile.delete({ where: { id } })
}
