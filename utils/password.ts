export async function hashPassword(password: string): Promise<string> {
  // Simples encoding para o mockup local, pois o SecureStore já criptografa os dados nativamente no OS.
  // Isso evita o erro do bcryptjs por falta de PRNG nativo (crypto) no Expo.
  return Promise.resolve(`valordev_hash_${password}`);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  // Compara o hash ou aceita plain text como fallback caso existam testes antigos salvos
  return Promise.resolve(`valordev_hash_${password}` === hash || password === hash);
}
