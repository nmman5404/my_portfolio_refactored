---
title: "Project Agentic RAG System"
slug: "agentic-rag-system"
kind: "project"
preset: "project"
permalink: "/projects/Agentic_RAG_System/Agentic_RAG_System.html"
---

<main class="max-w-4xl mx-auto px-6 pt-32 pb-20">

<!-- Header Bài viết -->
<div class="mb-10 text-center">
<p class="text-blue-600 dark:text-blue-500 font-mono mb-3">Project Case Study</p>
<h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
Agentic RAG System
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
<img src="proj1_banner.png" 
alt="Project Banner" 
class="w-full h-full object-cover">
</div>

<!-- Khung Nội Dung Text -->
<article class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">

## Tổng quan

Agentic RAG là một bước tiến từ chatbot hỏi-đáp truyền thống (rule-based) sang một AI Agent có khả năng hiểu ngữ cảnh và xử lý linh hoạt. Thay vì chỉ truy xuất thông tin dựa trên so khớp từ khóa một cách cứng nhắc, hệ thống có thể diễn giải câu hỏi và phản hồi tự nhiên hơn.

Khi người dùng đưa ra câu hỏi phức tạp hoặc mơ hồ, Agent không chỉ trả lời trực tiếp mà còn có khả năng phân tích ý định, truy xuất thông tin liên quan và tổng hợp câu trả lời phù hợp. Đồng thời, hệ thống còn tích hợp cơ chế kiểm duyệt nội dung và ghi nhớ ngữ cảnh qua nhiều lượt hội thoại.

Mục tiêu của dự án là xây dựng một trợ lý AI sử dụng RAG kết hợp với bộ dữ liệu <a href="https://huggingface.co/datasets/ura-hcmut/zalo_e2eqa/tree/refs%2Fpr%2F1" target="_blank"> zalo_e2eqa </a>, nhằm cung cấp câu trả lời chính xác, tự nhiên và an toàn.

## Các công cụ

- **Ngôn ngữ lập trình:** Python
- **Framework/ Thư viện:** LangGraph (quản lý State/ luồng đồ thị) và LangChain (Hugging Face, Ollama), Ollama (Local LLM: Qwen 2.5 7B).
- **Database:** Vector Database (Chroma)

## Tính năng, Thách thức và Giải pháp

- **Định hình ngữ cảnh sinh văn bản (Contextual Grounding):** Ở những phiên bản đầu tiên, Agent thường đưa ra các câu trả lời cộc lốc, khuyết thiếu chủ ngữ (ví dụ: hỏi "Ai tạo ra Unikey?", model chỉ đáp "Phạm Kim Long"). Điều này làm đứt gãy mạch logic của cuộc hội thoại. Vấn đề này được giải quyết bằng kỹ thuật Prompt Engineering, ép mô hình áp dụng cấu trúc \[Nhắc lại câu hỏi\]-\[Cung cấp câu trả lời\], đảm bảo văn bản sinh ra luôn trọn vẹn ngữ nghĩa và tạo tiền đề tốt cho các lượt chat sau.
- **Điều phối luồng (Orchestration) và Bảo mật với LangGraph:** Để thoát khỏi những hạn chế của một pipeline RAG tuyến tính, hệ thống được tái cấu trúc toàn diện sang dạng đồ thị bằng LangGraph. Nâng cấp này cho phép thiết lập một trạm kiểm duyệt (Guardrail) ngay tại đầu vào của đồ thị. Bằng việc kết hợp các biểu thức chính quy (Regex) đơn giản nhưng tốc độ cao, hệ thống có thể phân luồng dữ liệu, chặn các truy vấn nhạy cảm trước khi chúng kịp tiêu tốn tài nguyên tính toán của Vector DB.
- **Quản lý Trạng thái Hội thoại (State Memory):** Tích hợp cơ chế MemorySaver giúp quản lý State của LangGraph. Tính năng này cấp cho Agent một trí nhớ gắn liền với từng định danh phiên chat (Thread ID), cho phép hệ thống duy trì các cuộc đối thoại đa lượt (Multi-turn) một cách tự nhiên và xuyên suốt.
- **Khắc phục chứng "Trôi dạt sự chú ý" (Attention Drift):** Việc sở hữu bộ nhớ dài lại sinh ra một "tác dụng phụ" nguy hiểm: LLM dễ bị "lú lẫn" với các đại từ (anh ấy, quốc gia này) và bị phân tâm bởi các chủ đề ở lượt chat quá cũ. Bài toán khó này được hóa giải bằng cách xây dựng một hàm Query Rewriting (Viết lại truy vấn) trực tiếp ngay bên trong node Retriever. Tại đây, kĩ thuật Few-Shot Prompting được áp dụng, toàn bộ lịch sử chat được đưa vào để yêu cầu Agent tổng hợp thông tin quá khứ cùng câu hỏi mập mờ thành một câu truy vấn độc lập. Nhờ đó, Vector DB luôn truy xuất tài liệu cần thiết chính xác hơn, loại bỏ hiện tượng mất dấu ngữ cảnh của hệ thống.

<div class="mt-12 flex justify-center">
<a href="https://github.com/nmman5404/MiniChatBot" target="_blank" class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/40">
Xem mã nguồn trên GitHub
</a>
</div>

</article>
</main>
