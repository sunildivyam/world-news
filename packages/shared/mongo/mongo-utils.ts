import { ObjectId } from "mongodb";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toNormalFormat(data: any) {
  if (Array.isArray(data)) {
    return data.map((item: any) => ({
      ...item,
      _id: item._id?.toString() || undefined,
    }));
  }

  return { ...data, _id: data._id?.toString() || undefined };
}

export function toDbFormat(data: any, cleanId: boolean = false) {
  if (Array.isArray(data)) {
    return data.map((item: any) => {
      if (cleanId) {
        delete item._id;
        return { ...item };
      }

      return {
        ...item,
        _id: item._id ? new ObjectId(item._id) : undefined,
      };
    });
  }

  // clean _id
  if (cleanId) {
    delete data._id;
    return { ...data };
  }

  return { ...data, _id: data._id ? new ObjectId(data._id) : undefined };
}
