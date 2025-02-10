import { invoke } from "@tauri-apps/api/core";

const saveToFile = async (
  content: string,
  fileName: string,
): Promise<string> => {
  return await invoke("save_to_file", { content, fileName: fileName });
};

const generateUUIDV1 = async (n?: number): Promise<string[]> => {
  return await invoke("gen_uuid_v1", { n: n || 1 });
};

const generateUUIDV3 = async (
  namespace: string,
  name: string,
  n?: number,
): Promise<string[]> => {
  return await invoke("gen_uuid_v3", {
    namespace,
    name: name || "name",
    n: n || 1,
  });
};

const generateUUIDV4 = async (n?: number): Promise<string[]> => {
  return await invoke("gen_uuid_v4", { n: n || 1 });
};

const generateUUIDV5 = async (
  namespace: string,
  name: string,
  n?: number,
): Promise<string[]> => {
  return await invoke("gen_uuid_v5", {
    namespace,
    name: name || "name",
    n: n || 1,
  });
};

const generateUUIDV6 = async (n?: number): Promise<string[]> => {
  return await invoke("gen_uuid_v6", { n: n || 1 });
};

const generateUUIDV7 = async (n?: number): Promise<string[]> => {
  return await invoke("gen_uuid_v7", { n: n || 1 });
};

const generateShortUUID = async (n?: number): Promise<string[]> => {
  return await invoke("gen_short_uuid", { n: n || 1 });
};

const generateNilUUID = async (n?: number): Promise<string[]> => {
  return await invoke("gen_nil_uuid", { n: n || 1 });
};

const generateMaxUUID = async (n?: number): Promise<string[]> => {
  return await invoke("gen_max_uuid", { n: n || 1 });
};

const generateNanoID = async (n?: number): Promise<string[]> => {
  return await invoke("gen_nano_id", { n: n || 1 });
};

const generateULID = async (n?: number): Promise<string[]> => {
  return await invoke("gen_ulid", { n: n || 1 });
};

const generateCUID = async (n?: number): Promise<string[]> => {
  return await invoke("gen_cuid", { n: n || 1 });
};

const generateCUID2 = async (n?: number): Promise<string[]> => {
  return await invoke("gen_cuid2", { n: n || 1 });
};

const generateSnowflake = async (n?: number): Promise<string[]> => {
  return await invoke("gen_snowflake", { n: n || 1 });
};

const generateSonyflake = async (n?: number): Promise<string[]> => {
  return await invoke("gen_sonyflake", { n: n || 1 });
};

const generateNUID = async (n?: number): Promise<string[]> => {
  return await invoke("gen_nuid", { n: n || 1 });
};

const generateUPID = async (prefix: string, n?: number): Promise<string[]> => {
  return await invoke("gen_upid", { prefix, n: n || 1 });
};

const generateTSID = async (n?: number): Promise<string[]> => {
  return await invoke("gen_tsid", { n: n || 1 });
};

const generateObjectID = async (n?: number): Promise<string[]> => {
  return await invoke("gen_object_id", { n: n || 1 });
};

const generateSCRU128 = async (n?: number): Promise<string[]> => {
  return await invoke("gen_scru128", { n: n || 1 });
};

export default {
  saveToFile,
  generateUUIDV1,
  generateUUIDV3,
  generateUUIDV4,
  generateUUIDV5,
  generateUUIDV6,
  generateUUIDV7,
  generateShortUUID,
  generateNilUUID,
  generateMaxUUID,
  generateNanoID,
  generateULID,
  generateCUID,
  generateCUID2,
  generateNUID,
  generateUPID,
  generateTSID,
  generateSnowflake,
  generateSonyflake,
  generateObjectID,
  generateSCRU128,
};
