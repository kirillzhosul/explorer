export type ITEM_API_DTO = {
  path: string;
  type_: "dir" | "file" | "disk";
  readonly: boolean;
  attributes: {
    windows: number;
  };
  file_size: number;
};
