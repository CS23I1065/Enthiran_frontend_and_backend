import { openDB, type DBSchema } from "idb"

interface MyDB extends DBSchema {
  files: {
    key: string
    value: {
      id: string
      name: string
      type: string
      lastUpdated: string
      data: ArrayBuffer
    }
  }
}

const dbPromise = openDB<MyDB>("FileStorage", 1, {
  upgrade(db) {
    db.createObjectStore("files", { keyPath: "id" })
  },
})

export async function storeFile(file: File): Promise<string> {
  const db = await dbPromise
  const id = Date.now().toString()
  const arrayBuffer = await file.arrayBuffer()
  await db.put("files", {
    id,
    name: file.name,
    type: file.type,
    lastUpdated: new Date().toISOString(),
    data: arrayBuffer,
  })
  return id
}

export async function getFile(id: string): Promise<File | null> {
  const db = await dbPromise
  const fileData = await db.get("files", id)
  if (!fileData) return null
  return new File([fileData.data], fileData.name, { type: fileData.type })
}

export async function getAllFiles(): Promise<Array<{ id: string; name: string; lastUpdated: string; type: string }>> {
  const db = await dbPromise
  const files = await db.getAll("files")
  return files.map(({ id, name, lastUpdated, type }) => ({ id, name, lastUpdated, type }))
}

export async function deleteFile(id: string): Promise<void> {
  const db = await dbPromise
  await db.delete("files", id)
}

