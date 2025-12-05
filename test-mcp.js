/**
 * Simple test script for MCP functionality
 */

const axios = require('axios');

// MCP服务器地址
const MCP_SERVER_URL = 'http://localhost:3001/mcp';

// 测试用例
async function testMCP() {
  console.log('Testing MCP functionality...\n');
  
  try {
    // 1. 测试ping方法
    console.log('1. Testing ping method:');
    const pingResponse = await axios.post(MCP_SERVER_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "ping"
    });
    console.log('Ping response:', JSON.stringify(pingResponse.data, null, 2));
    console.log('\n');
    
    // 2. 测试list_resources方法
    console.log('2. Testing list_resources method:');
    const listResourcesResponse = await axios.post(MCP_SERVER_URL, {
      jsonrpc: "2.0",
      id: 2,
      method: "list_resources"
    });
    console.log('List resources response:', JSON.stringify(listResourcesResponse.data, null, 2));
    console.log('\n');
    
    // 3. 测试read_resource方法 (time-service)
    console.log('3. Testing read_resource method for time-service:');
    const readTimeResourceResponse = await axios.post(MCP_SERVER_URL, {
      jsonrpc: "2.0",
      id: 3,
      method: "read_resource",
      params: {
        uri: "resource://time-service"
      }
    });
    console.log('Read time resource response:', JSON.stringify(readTimeResourceResponse.data, null, 2));
    console.log('\n');
    
    // 4. 测试read_resource方法 (llm-service)
    console.log('4. Testing read_resource method for llm-service:');
    const readLLMResourceResponse = await axios.post(MCP_SERVER_URL, {
      jsonrpc: "2.0",
      id: 4,
      method: "read_resource",
      params: {
        uri: "resource://llm-service"
      }
    });
    console.log('Read LLM resource response:', JSON.stringify(readLLMResourceResponse.data, null, 2));
    console.log('\n');
    
    // 5. 测试list_tools方法
    console.log('5. Testing list_tools method:');
    const listToolsResponse = await axios.post(MCP_SERVER_URL, {
      jsonrpc: "2.0",
      id: 5,
      method: "list_tools"
    });
    console.log('List tools response:', JSON.stringify(listToolsResponse.data, null, 2));
    console.log('\n');
    
    // 6. 测试call_tool方法 (get_current_time)
    console.log('6. Testing call_tool method for get_current_time:');
    const callToolResponse = await axios.post(MCP_SERVER_URL, {
      jsonrpc: "2.0",
      id: 6,
      method: "call_tool",
      params: {
        name: "get_current_time",
        arguments: {}
      }
    });
    console.log('Call tool response:', JSON.stringify(callToolResponse.data, null, 2));
    console.log('\n');
    
    console.log('All MCP tests completed successfully!');
  } catch (error) {
    console.error('Error testing MCP functionality:', error.response ? error.response.data : error.message);
  }
}

// 运行测试
testMCP();