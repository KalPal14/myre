import dedent from 'dedent-js';

export function translatePrompt(from: string, to: string, translate: string): string {
	return dedent`
   Language A: ${from}
   Language B: ${to}
   Input: ${translate}

   Instructions:

      Determine the input type:
         If the input is a single word or a stable expression, provide detailed linguistic information, including translations, synonyms, definitions, lemma and examples in the following JSON format:

   {
   "type": "dictionary",
   "lemma": "If an input contains a word that has a lemma, then this field must contain the lemma of this word in Language A. If an input contains a word or phrase that does not have one specific lemma, then assign null to this field.",
   "translation": ["List of translations (in array format) of the word or phrase from Language A to Language B, sorted by relevance"],
   "synonyms": ["List of synonyms of the word or phrase in Language A (in array format)"],
   "from_description": "Text description of the word or phrase in Language A",
   "to_description": "Translated description of the word or phrase in Language B",
   "examples": [
         {
            "from": "Example sentence using the word or phrase in Language A",
            "to": "Translation of the example sentence in Language B"
         },
         {
            "from": "Another example sentence in Language A",
            "to": "Translation of the second example in Language B"
         }
   ]
   }

   If the input is a sentence or a longer text, return only the translation in the following JSON format:

   {
   "type": "translation",
   "translation": ["Translated text in Language B"]
   }`;
}
