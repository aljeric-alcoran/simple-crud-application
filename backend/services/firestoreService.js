const { db } = require("../config/firebase");

const firestoreService = {
  // Get all documents in a collection
  async getAll(collection) {
    const snapshot = await db.collection(collection).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Get a single document by ID
  async getById(collection, id) {
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  // Create a document (auto-generated ID)
  async create(collection, data) {
    const ref = await db.collection(collection).add({
      ...data,
      createdAt: new Date().toISOString(),
    });
    return { id: ref.id, ...data };
  },

  // Update a document
  async update(collection, id, data) {
    await db.collection(collection).doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { id, ...data };
  },

  // Delete a document
  async delete(collection, id) {
    await db.collection(collection).doc(id).delete();
    return { id };
  },

  // Query with filters
  async query(collection, field, operator, value) {
    const snapshot = await db
      .collection(collection)
      .where(field, operator, value)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
};

module.exports = firestoreService;