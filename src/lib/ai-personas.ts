/**
 * AI Model to Persona Mapping
 * Maps underlying AI provider names to user-friendly persona names
 */
export const AI_PERSONAS = {
  groq: 'SoftBot',
  mistral: 'HelperAI',
  gemini: 'AssistPro',
  cohere: 'InsightAI',
  openai: 'ProAnalyst',
  gpt4: 'ProAnalyst',
  claude: 'AssistantPlus',
} as const;

export type AIProvider = keyof typeof AI_PERSONAS;

/**
 * Get the persona name for an AI provider
 */
export function getPersonaName(provider: string): string {
  const normalizedProvider = provider.toLowerCase() as AIProvider;
  return AI_PERSONAS[normalizedProvider] || 'AI Assistant';
}

/**
 * Clean AI provider name from text - removes provider keywords before sending to client
 */
export function stripProviderName(text: string): string {
  const providers = Object.keys(AI_PERSONAS);
  let cleanedText = text;

  // Remove provider names in various formats
  for (const provider of providers) {
    const patterns = [
      new RegExp(`\\b${provider}\\b`, 'gi'),
      new RegExp(`according to ${provider}`, 'gi'),
      new RegExp(`${provider} says`, 'gi'),
    ];

    for (const pattern of patterns) {
      cleanedText = cleanedText.replace(pattern, '');
    }
  }

  return cleanedText.trim();
}
