
import algoliasearch from "algoliasearch";



const client = algoliasearch('82V25X16NI', 'b5521161f16e4ae727d51d560146e17c');
export const index = client.initIndex('pets');