
import algoliasearch from "algoliasearch";



const client = algoliasearch('82V25X16NI', process.env.ALGOLIA_SECRET);
export const index = client.initIndex('pets');