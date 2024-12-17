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
      "type": "definition",
      "wordForm": "Check Input in language A is written without grammatical errors? If there are mistakes write down the corrected word here, if there are no mistakes, return it without changing it.",
      "lemma":
         "If an input contains a word that has a lemma, then this field must contain the lemma of this word in Language A. If an input contains a word or phrase that does not have one specific lemma, then assign null to this field.",
      "definitionFrom": {
         "synonyms": [
            "List of synonyms of the word or phrase in Language A (in array format), sorted by relevance",
         ],
         "description": "Text description of the word or phrase in Language A",
         "examples": [
            "List of example sentences (in array format) using the word or phrase in Language A",
         ]
      },
      "definitionTo": {
         "synonyms": [
            "List of translations (in array format) of the word or phrase from Language A to Language B, sorted by relevance",
         ],
         "description": "Translated description of the word or phrase in Language B",
         "examples": [
            "List of translations (in array format) of the definitionFrom.examples sentences in Language B",
         ]
      }  
   }

   If the input is a sentence or a longer text, return only the translation in the following JSON format:

   {
   "type": "translation",
   "translation": ["Translated text in Language B"]
   }`;
}
