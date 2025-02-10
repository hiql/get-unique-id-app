import { useEffect, useState } from "react";
import {
  Text,
  Flex,
  Theme,
  Box,
  Select,
  Button,
  TextField,
  IconButton,
  DropdownMenu,
  Separator,
  Tooltip,
  Badge,
  Switch,
  RadioGroup,
  ScrollArea,
} from "@radix-ui/themes";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import useResizeObserver from "use-resize-observer";
import { FormattedMessage, IntlProvider, useIntl } from "react-intl";
import {
  CopyIcon,
  DownloadIcon,
  MinusIcon,
  PlusIcon,
  QuestionMarkCircledIcon,
  ShuffleIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import "@radix-ui/themes/styles.css";
import "./App.css";
import { useCopy, useLocalStorage, useTheme } from "./hooks";
import { isDigit, isLetter, sleep } from "./utils";
import natives from "./natives";

interface IDVersion {
  key: string;
  name: string;
}

interface PredefinedUUID {
  id: string;
  name: string;
}

const ID_VERSIONS: IDVersion[] = [
  { key: "uuidv1", name: "UUID v1(Gregorian Time-based)" },
  { key: "uuidv3", name: "UUID v3(MD5 Name-based)" },
  { key: "uuidv4", name: "UUID v4(Random)" },
  { key: "uuidv5", name: "UUID v5(SHA-1 Name-based)" },
  { key: "uuidv6", name: "UUID v6(Reordered Gregorian Time-based)" },
  { key: "uuidv7", name: "UUID v7(Unix Time-based)" },
  { key: "shortuuid", name: "Short UUID" },
  { key: "niluuid", name: "Nil UUID" },
  { key: "maxuuid", name: "Max UUID" },
  { key: "ulid", name: "ULID" },
  { key: "upid", name: "UPID" },
  { key: "cuid", name: "CUID" },
  { key: "cuid2", name: "CUID2" },
  { key: "nanoid", name: "Nano ID" },
  { key: "nuid", name: "NUID" },
  { key: "tsid", name: "TSID" },
  { key: "scru128", name: "SCRU128" },
  { key: "snowflake", name: "Snowflake" },
  { key: "sonyflake", name: "Sonyflake" },
  { key: "objectid", name: "Object ID" },
];

const PREDEFINED_UUIDS: PredefinedUUID[] = [
  { id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8", name: "DNS" },
  { id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8", name: "URL" },
  { id: "6ba7b812-9dad-11d1-80b4-00c04fd430c8", name: "OID" },
  { id: "6ba7b814-9dad-11d1-80b4-00c04fd430c8", name: "X.500" },
];

const MIN_BULK_QUANTITY = 1;
const MAX_BULK_QUANTITY = 500;
const DFT_BULK_QUANTITY = 10;

const messagesInChinese = {
  uniqueIDVersion: "选择类型：",
  namespace: "命名空间：",
  namespacePlaceholder: "输入命名空间UUID值（默认随机）",
  namespaceTooltip:
    "命名空间必须是格式为00000000-0000-0000-0000-000000000000的有效UUID值。请选择一个预设的UUID值或自动填充随机UUID值。",
  name: "名称：",
  namePlaceholder: "输入名称（默认是‘name’）",
  nameTooltip:
    "必填项。名称可以是任意内容。相同命名空间和相同名称将始终生成相同的UUID值。",
  prefix: "前缀：",
  prefixPlaceholder: "输入前缀（4个字符长度，默认是'zzzz'）",
  predefinedUUIDs: "预设UUID值",
  bulkGeneration: "批量生成",
  bulkQuantity: "批量生成数量（{min}~{max}）：",
  bulkOutput: "输出格式：",
  bulkOutputRaw: "原始",
  bulkOutputJson: "JSON",
  generatedResult: "生成结果：",
  regenerate: "重新生成",
  copyToClipboard: "拷贝至剪贴板",
  saveToFile: "保存至文件",
  copied: "已拷贝!",
};

function App({ changeLocale }: { changeLocale: (locale: string) => void }) {
  const [idVersion, setIDVersion] = useState("uuidv4");
  const [namespace, setNamespace] = useState("");
  const [name, setName] = useState("");
  const [namespaceType, setNamespaceType] = useState("");
  const [prefix, setPrefix] = useState("");
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(DFT_BULK_QUANTITY);
  const [bulkOutput, setBulkOutput] = useState("raw");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [bulkResult, setBulkResult] = useState<string[]>([]);
  const { isCopied, copyToClipboard } = useCopy();
  const { isCopied: isBulkCopied, copyToClipboard: copyBulkToClipboard } =
    useCopy();
  const intl = useIntl();

  async function generate(n: number) {
    let value: string[] = [];
    if (idVersion === "uuidv1") {
      value = await natives.generateUUIDV1(n);
    } else if (idVersion === "uuidv3") {
      value = await natives.generateUUIDV3(namespace, name, n);
    } else if (idVersion === "uuidv4") {
      value = await natives.generateUUIDV4(n);
    } else if (idVersion === "uuidv5") {
      value = await natives.generateUUIDV5(namespace, name, n);
    } else if (idVersion === "uuidv6") {
      value = await natives.generateUUIDV6(n);
    } else if (idVersion === "uuidv7") {
      value = await natives.generateUUIDV7(n);
    } else if (idVersion === "shortuuid") {
      value = await natives.generateShortUUID(n);
    } else if (idVersion === "niluuid") {
      value = await natives.generateNilUUID(n);
    } else if (idVersion === "maxuuid") {
      value = await natives.generateMaxUUID(n);
    } else if (idVersion === "ulid") {
      value = await natives.generateULID(n);
    } else if (idVersion === "nanoid") {
      value = await natives.generateNanoID(n);
    } else if (idVersion === "cuid") {
      value = await natives.generateCUID(n);
    } else if (idVersion === "cuid2") {
      value = await natives.generateCUID2(n);
    } else if (idVersion === "snowflake") {
      value = await natives.generateSnowflake(n);
    } else if (idVersion === "sonyflake") {
      value = await natives.generateSonyflake(n);
    } else if (idVersion === "nuid") {
      value = await natives.generateNUID(n);
    } else if (idVersion === "upid") {
      value = await natives.generateUPID(prefix || "zzzz", n);
    } else if (idVersion === "tsid") {
      value = await natives.generateTSID(n);
    } else if (idVersion === "objectid") {
      value = await natives.generateObjectID(n);
    } else if (idVersion === "scru128") {
      value = await natives.generateSCRU128(n);
    }
    return value;
  }

  async function generateOne() {
    setIsGenerating(true);
    const newID = (await generate(1))[0];
    setResult(newID);
    setIsGenerating(false);
  }

  async function generateBulk() {
    setIsGenerating(true);
    await sleep(100);
    const ids = await generate(bulkQuantity);
    setBulkResult(ids);
    setIsGenerating(false);
  }

  useEffect(() => {
    generateOne();
    setBulkResult([]);
  }, [idVersion, namespace, name, prefix]);

  async function setWindowHeight(height: number) {
    await getCurrentWindow().setSize(new LogicalSize(480, height));
  }

  const { ref: windowInnerBoxRef } = useResizeObserver<HTMLDivElement>({
    onResize: ({ height }) => {
      if (height) {
        setWindowHeight(height);
      }
    },
  });

  useEffect(() => {
    document.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        return false;
      },
      { capture: true }
    );
  }, []);

  return (
    <Box ref={windowInnerBoxRef} data-tauri-drag-region>
      <Flex height="30px" justify="end" p="4" data-tauri-drag-region>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" color="gray">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d=" M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z "
                ></path>
              </svg>
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              onClick={() => changeLocale && changeLocale("en")}
            >
              English
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => changeLocale && changeLocale("cn")}
            >
              简体中文
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
      <Flex direction="column" gap="2" p="3" data-tauri-drag-region>
        <Text weight="medium" size="2">
          <FormattedMessage
            id="uniqueIDVersion"
            defaultMessage="Unique ID version:"
          />
        </Text>
        <Select.Root
          defaultValue={idVersion}
          onValueChange={(value) => setIDVersion(value)}
        >
          <Select.Trigger />
          <Select.Content position="popper">
            {ID_VERSIONS.map((version) => (
              <Select.Item value={version.key} key={version.key}>
                {version.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        {idVersion === "uuidv3" || idVersion === "uuidv5" ? (
          <>
            <Text weight="medium" size="2">
              <FormattedMessage id="namespace" defaultMessage="Namespace:" />
            </Text>
            <TextField.Root
              placeholder={intl.formatMessage({
                id: "namespacePlaceholder",
                defaultMessage: "Enter namespace UUID(default is random)",
              })}
              size="2"
              value={namespace}
              onChange={(e) => {
                setNamespace(e.target.value);
                setNamespaceType("");
              }}
            >
              <TextField.Slot side="right" gap="2">
                {namespaceType ? (
                  <Badge color="amber" mr="2">
                    {namespaceType}
                  </Badge>
                ) : null}
                <IconButton
                  size="1"
                  variant="ghost"
                  onClick={async () => {
                    const id = (await natives.generateUUIDV4())[0];
                    setNamespace(id);
                    setNamespaceType("");
                  }}
                >
                  <ShuffleIcon height="14" width="14" />
                </IconButton>
                <Separator orientation="vertical" />
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <IconButton size="1" variant="ghost">
                      <DropdownMenu.TriggerIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Label>
                      <FormattedMessage
                        id="predefinedUUIDs"
                        defaultMessage="Pre-defined UUIDs"
                      />
                    </DropdownMenu.Label>
                    {PREDEFINED_UUIDS.map((uuid) => (
                      <DropdownMenu.Item
                        key={uuid.id}
                        onClick={() => {
                          setNamespace(uuid.id);
                          setNamespaceType(uuid.name);
                        }}
                      >
                        {uuid.name}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
                <Separator orientation="vertical" />
                <Tooltip
                  content={intl.formatMessage({
                    id: "namespaceTooltip",
                    defaultMessage:
                      "The namespace must be a valid UUIDs in the format 00000000-0000-0000-0000-000000000000. select a pre-defined UUID or autofill with random UUID.",
                  })}
                >
                  <QuestionMarkCircledIcon color="gray" />
                </Tooltip>
              </TextField.Slot>
            </TextField.Root>
            <Text weight="medium" size="2">
              <FormattedMessage id="name" defaultMessage="Name:" />
            </Text>
            <TextField.Root
              placeholder={intl.formatMessage({
                id: "namePlaceholder",
                defaultMessage: "Enter name(default is 'name')",
              })}
              size="2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            >
              <TextField.Slot side="right">
                <Tooltip
                  content={intl.formatMessage({
                    id: "nameTooltip",
                    defaultMessage:
                      "Required. Name can be anything. The same namespace with the same name will always produce the same UUID.",
                  })}
                >
                  <QuestionMarkCircledIcon color="gray" />
                </Tooltip>
              </TextField.Slot>
            </TextField.Root>
          </>
        ) : null}
        {idVersion === "upid" ? (
          <>
            <Text weight="medium" size="2">
              <FormattedMessage id="prefix" defaultMessage="Prefix:" />
            </Text>
            <TextField.Root
              placeholder={intl.formatMessage({
                id: "prefixPlaceholder",
                defaultMessage:
                  "Enter a prefix(4 characters,default is 'zzzz')",
              })}
              size="2"
              maxLength={4}
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
            />
          </>
        ) : null}

        <Flex
          direction="column"
          gap="2"
          p="2"
          mt="4"
          style={{
            border: "1px solid var(--gray-6)",
            borderRadius: "var(--radius-2)",
            cursor: "default",
          }}
        >
          <Flex data-tauri-drag-region justify="between" align="center">
            <Text as="label" htmlFor="enable_bulk" size="2" weight="medium">
              <FormattedMessage
                id="bulkGeneration"
                defaultMessage="Bulk Generation"
              />
            </Text>
            <Switch
              id="enable_bulk"
              checked={isBulkMode}
              onCheckedChange={(checked) => setIsBulkMode(checked)}
            />
          </Flex>
          {isBulkMode ? (
            <>
              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <Text size="2">
                    <FormattedMessage
                      id="bulkQuantity"
                      defaultMessage={`Number of unique IDs to generate({min}~ {max}):`}
                      values={{
                        min: MIN_BULK_QUANTITY,
                        max: MAX_BULK_QUANTITY,
                      }}
                    />
                  </Text>
                  <TextField.Root
                    style={{ width: 100 }}
                    type="number"
                    value={bulkQuantity}
                    onChange={(e) => {
                      if (!e.target.value) {
                        setBulkQuantity(MIN_BULK_QUANTITY);
                        return;
                      }
                      const value = parseInt(e.target.value, 10);
                      if (value <= MIN_BULK_QUANTITY) {
                        setBulkQuantity(MIN_BULK_QUANTITY);
                      } else if (value >= MAX_BULK_QUANTITY) {
                        setBulkQuantity(MAX_BULK_QUANTITY);
                      } else {
                        setBulkQuantity(parseInt(e.target.value, 10));
                      }
                    }}
                  >
                    <TextField.Slot side="right">
                      <IconButton
                        size="1"
                        variant="ghost"
                        onClick={() => {
                          if (bulkQuantity >= MAX_BULK_QUANTITY) {
                            setBulkQuantity(MAX_BULK_QUANTITY);
                          } else {
                            setBulkQuantity(bulkQuantity + 1);
                          }
                        }}
                      >
                        <PlusIcon />
                      </IconButton>
                      <IconButton
                        size="1"
                        variant="ghost"
                        onClick={() => {
                          if (bulkQuantity <= MIN_BULK_QUANTITY) {
                            setBulkQuantity(MIN_BULK_QUANTITY);
                          } else {
                            setBulkQuantity(bulkQuantity - 1);
                          }
                        }}
                      >
                        <MinusIcon />
                      </IconButton>
                    </TextField.Slot>
                  </TextField.Root>
                </Flex>
                <Flex align="center" gap="2">
                  <Text size="2">
                    <FormattedMessage
                      id="bulkOutput"
                      defaultMessage="Output format:"
                    />
                  </Text>
                  <RadioGroup.Root
                    value={bulkOutput}
                    onValueChange={(value) => setBulkOutput(value)}
                    radioGroup="bulkOutput"
                  >
                    <Flex align="center" gap="2">
                      <Text as="label" size="2">
                        <Flex gap="2">
                          <RadioGroup.Item value="raw" />
                          <FormattedMessage
                            id="bulkOutputRaw"
                            defaultMessage="Raw"
                          />
                        </Flex>
                      </Text>
                      <Text as="label" size="2">
                        <Flex gap="2">
                          <RadioGroup.Item value="json" />
                          <FormattedMessage
                            id="bulkOutputJson"
                            defaultMessage="JSON"
                          />
                        </Flex>
                      </Text>
                    </Flex>
                  </RadioGroup.Root>
                </Flex>
              </Flex>
            </>
          ) : null}
        </Flex>
        <Flex align="center" justify="between">
          <Text weight="medium" size="2">
            <FormattedMessage
              id="generatedResult"
              defaultMessage="Generated result:"
            />
          </Text>
        </Flex>

        {isBulkMode ? (
          <Box
            style={{
              height: 210,
              border: "1px solid var(--gray-6)",
              borderRadius: "var(--radius-2)",
              backgroundColor: "var(--color-surface)",
              cursor: "default",
              padding: 2,
            }}
          >
            <ScrollArea>
              {bulkOutput === "raw" ? (
                bulkResult.map((item, rownum) => (
                  <Flex px="1">
                    <Text
                      as="div"
                      style={{
                        minWidth: 35,
                        paddingRight: 8,
                        borderRight: "1px solid var(--gray-4)",
                        textAlign: "right",
                        color: "var(--gray-8)",
                      }}
                      mr="2"
                      size="2"
                    >
                      {rownum + 1}
                    </Text>
                    <Text size="2">{item}</Text>
                  </Flex>
                ))
              ) : bulkOutput === "json" ? (
                <Text size="2">
                  <pre>
                    {bulkResult.length > 0
                      ? JSON.stringify(bulkResult, undefined, 2)
                      : ""}
                  </pre>
                </Text>
              ) : null}
            </ScrollArea>
          </Box>
        ) : (
          <Box
            style={{
              border: "1px solid var(--gray-6)",
              borderRadius: "var(--radius-2)",
              backgroundColor: "var(--color-surface)",
              cursor: "default",
              padding: "2px 8px",
            }}
          >
            <Flex
              style={{ height: 65 }}
              flexGrow="1"
              align="center"
              justify="center"
            >
              {[...result].map((char, i) =>
                char === " " ? (
                  <span key={i}>&nbsp;</span>
                ) : (
                  <Text
                    size="5"
                    key={i}
                    color={
                      isLetter(char)
                        ? undefined
                        : isDigit(char)
                        ? "blue"
                        : "orange"
                    }
                    weight="medium"
                  >
                    {char}
                  </Text>
                )
              )}
            </Flex>
          </Box>
        )}
        <Flex
          gap="3"
          align="center"
          justify="center"
          my="2"
          data-tauri-drag-region
        >
          <Button
            loading={isGenerating}
            onClick={async () => {
              if (isBulkMode) {
                await generateBulk();
              } else {
                await generateOne();
              }
            }}
          >
            <UpdateIcon />
            <FormattedMessage id="regenerate" defaultMessage={"Regenerate"} />
          </Button>
          <Button
            variant="surface"
            disabled={isGenerating}
            color={isCopied || isBulkCopied ? "green" : "gray"}
            onClick={async () => {
              if (isBulkMode) {
                if (bulkResult.length > 0) {
                  if (bulkOutput === "raw") {
                    await copyBulkToClipboard(bulkResult.join("\n"));
                  } else if (bulkOutput === "json") {
                    await copyBulkToClipboard(
                      JSON.stringify(bulkResult, undefined, 2)
                    );
                  }
                }
              } else {
                if (result) {
                  await copyToClipboard(result);
                }
              }
            }}
          >
            {isCopied || isBulkCopied ? (
              <FormattedMessage id="copied" defaultMessage="Copied!" />
            ) : (
              <>
                <CopyIcon />
                <FormattedMessage
                  id="copyToClipboard"
                  defaultMessage={"Copy to clipboard"}
                />
              </>
            )}
          </Button>
          {isBulkMode ? (
            <Button
              variant="surface"
              color="gray"
              disabled={isGenerating}
              onClick={async () => {
                if (bulkResult.length === 0) {
                  return;
                }

                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, "0");
                const day = String(now.getDate()).padStart(2, "0");
                const hours = String(now.getHours()).padStart(2, "0");
                const minutes = String(now.getMinutes()).padStart(2, "0");
                const seconds = String(now.getSeconds()).padStart(2, "0");
                const ts = `${year}${month}${day}${hours}${minutes}${seconds}`;

                if (bulkOutput === "raw") {
                  const fileName = `${idVersion}-export-${ts}.txt`;
                  await natives.saveToFile(bulkResult.join("\n"), fileName);
                } else if (bulkOutput === "json") {
                  const fileName = `${idVersion}-export-${ts}.json`;
                  await natives.saveToFile(
                    JSON.stringify(bulkResult, undefined, 2),
                    fileName
                  );
                }
              }}
            >
              <DownloadIcon />
              <FormattedMessage
                id="saveToFile"
                defaultMessage={"Save to file"}
              />
            </Button>
          ) : null}
        </Flex>
      </Flex>
    </Box>
  );
}

function AppWithProvider() {
  const theme = useTheme();
  const [storedLocaleValue, setLocaleValue] = useLocalStorage("language", "en");
  return (
    <IntlProvider
      messages={storedLocaleValue === "cn" ? messagesInChinese : {}}
      locale={storedLocaleValue}
      defaultLocale="en"
    >
      <Theme appearance={theme}>
        <App changeLocale={setLocaleValue} />
      </Theme>
    </IntlProvider>
  );
}

export default AppWithProvider;
