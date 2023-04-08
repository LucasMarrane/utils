import * as Yup from "yup";

type TSchemaFactory = (yup: typeof Yup) => Yup.Schema;

/**
 * Create a schema
 * @param callbackSchema 
 * @returns 
 */
export function schemaFactory(callbackSchema: TSchemaFactory) {
  return callbackSchema(Yup);
}

