import * as Yup from "yup";

type TSchemaFactory = (yup: typeof Yup) => Yup.Schema;

export function schemaFactory(callbackSchema: TSchemaFactory) {
  return callbackSchema(Yup);
}

