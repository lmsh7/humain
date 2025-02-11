export class SSEParser {
  constructor() {
    this.buffer = "";
    this.decoder = new TextDecoder();
  }

  parseEventData(data) {
    const lines = data.split("\n");
    let eventData = [];
    let currentData = [];

    for (const line of lines) {
      if (line.startsWith("data:")) {
        const value = line.slice(5).trim();
        if (value) {
          currentData.push(value);
        }
      } else if (line.trim() === "" && currentData.length > 0) {
        // 事件结束，处理累积的数据
        try {
          const fullData = currentData.join("\n");
          const parsed = JSON.parse(fullData);
          eventData.push(parsed);
          currentData = [];
        } catch (e) {
          console.error("Error parsing SSE data:", e);
        }
      }
    }

    // 如果还有未处理完的数据，保存到buffer
    if (currentData.length > 0) {
      return {
        events: eventData,
        remainder: currentData.join("\n")
      };
    }

    return {
      events: eventData,
      remainder: ""
    };
  }

  async *processStream(reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 解码并添加到buffer
        const chunk = this.decoder.decode(value, { stream: true });
        this.buffer += chunk;

        // 解析buffer中的完整事件
        const { events, remainder } = this.parseEventData(this.buffer);
        this.buffer = remainder;  // 保存未完成的数据到下一次处理

        // 产出所有完整的事件
        for (const event of events) {
          yield event;
        }
      }

      // 处理最后可能残留的数据
      if (this.buffer) {
        const { events } = this.parseEventData(this.buffer + "\n\n");
        for (const event of events) {
          yield event;
        }
      }
    } catch (err) {
      console.error("Stream processing error:", err);
    }
  }
}