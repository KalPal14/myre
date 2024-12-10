import dedent from 'dedent-js';

export function translatePrompt(from: string, to: string, translate: string): string {
	return dedent`
   Language A: ${from}
   Language B: ${to}
   Input: ${translate}

   Instructions:

      Determine the input type:
         If the input is a single word or a stable expression, provide detailed linguistic information, including translations, synonyms, definitions, and examples in the following JSON format:

   {
   "type": "dictionary",
   "translation": ["List of translations (in array format) of the word or phrase from Language A to Language B, sorted by relevance"],
   "synonyms": ["List of synonyms of the word or phrase in Language A (in array format)"],
   "definition_a": "Text description of the word or phrase in Language A",
   "definition_b": "Translated description of the word or phrase in Language B",
   "examples": [
         {
            "example": "Example sentence using the word or phrase in Language A",
            "translate": "Translation of the example sentence in Language B"
         },
         {
            "example": "Another example sentence in Language A",
            "translate": "Translation of the second example in Language B"
         }
   ]
   }

   If the input is a sentence or a longer text, return only the translation in the following JSON format:

   {
   "type": "translation",
   "translation": ["Translated text in Language B"]
   }`;
}
