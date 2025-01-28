export class SSEParser {
  constructor() {
    this.buffer = "";
    this.decoder = new TextDecoder();
  }

  parseEventData(chunk) {
    const lines = chunk.split("\n");
    const data = [];

    for (const line of lines) {
      if (line.startsWith("data:")) {
        const value = line.slice(5).trim();
        if (value) {
          try {
            data.push(JSON.parse(value));
          } catch (e) {
            console.error("Error parsing SSE data:", e);
          }
        }
      }
    }
    return data.length ? data[0] : null;
  }

  async *processStream(reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = this.decoder.decode(value, { stream: true });
        const event = this.parseEventData(chunk);
        if (event) yield event;
      }
    } catch (err) {
      console.error("Stream processing error:", err);
    }
  }
}
