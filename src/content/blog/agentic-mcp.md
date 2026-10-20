---
title: "Project AI-Driven Inventory Manager with MCP"
slug: "agentic-mcp"
kind: "project"
preset: "project"
permalink: "/projects/Agentic_MCP/Agentic_MCP.html"
---

<main class="max-w-4xl mx-auto px-6 pt-32 pb-20">

<!-- Header Bài viết -->
<div class="mb-10 text-center">
<p class="text-blue-600 dark:text-blue-500 font-mono mb-3">Project Case Study</p>
<h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
AI-Driven Inventory Manager with MCP
</h1>
<div class="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
<span>Nguyễn Minh Mẫn</span>
</div>
<div class="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
<span>2026</span>
</div>
</div>

<!-- Ảnh Hero (Banner chính) -->
<div class="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden mb-12 shadow-lg">
<img src="proj2_banner.png" 
alt="Project Banner" 
class="w-full h-full object-cover">
</div>

<!-- Khung Nội Dung Text -->
<article class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">

## Tổng quan

Trong bối cảnh các hệ thống AI ngày càng được tích hợp sâu vào ứng dụng doanh nghiệp, việc cho phép các Mô hình ngôn ngữ lớn (LLMs) truy cập trực tiếp vào cơ sở dữ liệu tiềm ẩn nhiều rủi ro nghiêm trọng. Các lỗ hổng như prompt injection, SQL injection, cũng như hiện tượng ảo giác (hallucination) có thể dẫn đến việc truy xuất sai dữ liệu, vi phạm tính toàn vẹn hoặc thậm chí gây ảnh hưởng đến hệ thống backend.

Dự án này cung cấp một ví dụ về cách xây dựng một hệ thống AI an toàn và có kiểm soát bằng cách kết hợp sức mạnh phân tích ngôn ngữ tự nhiên của LLM với độ tin cậy của Backend .NET thông qua chuẩn Model Context Protocol (MCP). Thay vì cho phép AI tương tác trực tiếp với cơ sở dữ liệu, hệ thống được thiết kế với sự tách biệt rõ ràng giữa hai phân hệ.

Cụ thể, LangGraph Python Agent đóng vai trò lớp điều phối thông minh, chịu trách nhiệm phân tích ý định người dùng, xử lý ngữ cảnh và điều hướng luồng truy xuất thông tin. Trong khi đó, Backend .NET đảm nhiệm toàn bộ logic nghiệp vụ và kiểm soát truy cập dữ liệu theo các nguyên tắc nghiêm ngặt. Cách tiếp cận này giúp giảm thiểu nguy cơ truy cập trái phép, đảm bảo tính toàn vẹn dữ liệu (ACID), đáp ứng các tiêu chuẩn bảo mật và độ tin cậy ở mức doanh nghiệp, đồng thời duy trì khả năng mở rộng của kiến trúc Microservices.

## Các công cụ

- **Kiến trúc & Giao thức:** N-tier architecture, Model Context Protocol (MCP).
- **Ngôn ngữ lập trình:** Python, C\#
- **Framework:** LangGraph (Agentic Workflow), LangChain, Ollama (Qwen 2.5 7B), ASP.NET Core (Web API),
- **Database:** MS SQL Server, Entity Framework Core

## Thách thức và Giải pháp

- **Rủi ro bảo mật trong Text-to-SQL:** Trong các hệ thống RAG truyền thống, LLM tự sinh câu lệnh SQL dựa trên schema, tiềm ẩn nguy cơ Prompt Injection và Hallucination có thể gây sai lệch hoặc phá hủy dữ liệu. Giải pháp là loại bỏ hoàn toàn việc cho AI truy cập trực tiếp Database, thay vào đó áp dụng kiến trúc N-Tier với một lớp McpController đóng vai trò "cổng giao tiếp", chỉ cho phép AI gọi endpoint /call thông qua JSON-RPC với tham số kiểm soát chặt chẽ, trong khi toàn bộ Business Logic và truy vấn LINQ được xử lý an toàn trong tầng InventoryService. Kết quả đạt được là sự phân tách trách nhiệm tuyệt đối, đảm bảo AI chỉ đóng vai trò điều phối thay vì thao tác trực tiếp với dữ liệu.
- **Khoảng trống ngữ nghĩa giữa ngôn ngữ tự nhiên và cơ sở dữ liệu quan hệ:** Hệ thống gặp lỗi khi xử lý các truy vấn mơ hồ như "Macbook dưới 30 triệu" do sự khác biệt giữa cách người dùng diễn đạt và dữ liệu lưu trữ ("Macbook" vs "Apple"), dẫn đến truy vấn trả về kết quả rỗng. Giải pháp là chuyển trọng tâm xử lý từ prompt sang backend bằng cách nâng cấp logic tìm kiếm trong InventoryService, sử dụng toán tử Contains trên nhiều trường (Brand.Name, Laptop.Name) để tăng độ linh hoạt. Ngoài ra, hệ thống có thể mở rộng bằng cách tích hợp vector database để thực hiện semantic search, giúp ánh xạ các biểu diễn ngôn ngữ khác nhau về cùng một thực thể. Kết quả là hệ thống đạt được khả năng tìm kiếm linh hoạt (fuzzy-like và semantic-aware), xử lý hiệu quả sự đa nghĩa của ngôn ngữ tự nhiên và cải thiện độ chính xác của Agentic workflow.

</article>           

<div class="mt-12 flex justify-center">
<a data-article-repo href="https://github.com/nmman5404/MCP_Agent" target="_blank" class="glass-optional glass-control glass-pill glass-accent px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/40">
Xem mã nguồn trên GitHub
</a>
</div>

</article>
</main>
