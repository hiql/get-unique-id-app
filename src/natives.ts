import { invoke } from "@tauri-apps/api/core";

const saveToFile = async (
  content: string,
  fileName: string,
): Promise<string> => {
  return await invoke("save_to_file", { content, fileName: fileName });
};

const generateUUIDV1 = async (): Promise<string> => {
  return await invoke("gen_uuid_v1", {});
};

const generateUUIDV3 = async (
  namespace: string,
  name: string,
): Promise<string> => {
  return await invoke("gen_uuid_v3", {
    namespace: namespace || (await generateUUIDV4()),
    name: name || "name",
  });
};

const generateUUIDV4 = async (): Promise<string> => {
  return await invoke("gen_uuid_v4", {});
};

const generateUUIDV5 = async (
  namespace: string,
  name: string,
): Promise<string> => {
  return await invoke("gen_uuid_v5", {
    namespace: namespace || (await generateUUIDV4()),
    name: name || "name",
  });
};

const generateUUIDV6 = async (): Promise<string> => {
  return await invoke("gen_uuid_v6", {});
};

const generateUUIDV7 = async (): Promise<string> => {
  return await invoke("gen_uuid_v7", {});
};

const generateShortUUID = async (): Promise<string> => {
  return await invoke("gen_short_uuid", {});
};

const generateNilUUID = async (): Promise<string> => {
  return await invoke("gen_nil_uuid", {});
};

const generateMaxUUID = async (): Promise<string> => {
  return await invoke("gen_max_uuid", {});
};

const generateNanoID = async (): Promise<string> => {
  return await invoke("gen_nano_id", {});
};

const generateULID = async (): Promise<string> => {
  return await invoke("gen_ulid", {});
};

const generateCUID = async (): Promise<string> => {
  return await invoke("gen_cuid", {});
};

const generateCUID2 = async (): Promise<string> => {
  return await invoke("gen_cuid2", {});
};

const generateSnowflake = async (): Promise<string> => {
  return await invoke("gen_snowflake", {});
};

const generateSonyflake = async (): Promise<string> => {
  return await invoke("gen_sonyflake", {});
};

const generateNUID = async (): Promise<string> => {
  return await invoke("gen_nuid", {});
};

const generateUPID = async (prefix: string): Promise<string> => {
  return await invoke("gen_upid", { prefix });
};

const generateTSID = async (): Promise<string> => {
  return await invoke("gen_tsid");
};

const generateObjectID = async (): Promise<string> => {
  return await invoke("gen_object_id");
};

const generateSCRU128 = async (): Promise<string> => {
  return await invoke("gen_scru128");
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
