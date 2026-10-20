// Add a project once here; both languages and pages are generated automatically.
// Display order follows items: insert new projects at the START to show them first.
// Move an entire item to change its position; no date-based sorting is applied.
export default {
  "pageSize": 4,
  // Each action uses the matching published Markdown article as its AI context.
  // Keep these prompts in one place; {title} is filled from the selected card.
  "summary": {
    "accessibleLabel": {
      "en": "Summarize {title} with the AI assistant",
      "vi": "Tóm tắt dự án {title} với trợ lý AI"
    },
    "prompt": {
      "en": "Summarize the project “{title}”.",
      "vi": "Tóm tắt dự án “{title}”."
    }
  },
  "navigation": {
    "en": "Projects",
    "vi": "Dự Án"
  },
  "items": [
    {
      "id": "Agentic_RAG_System",
      "articleId": "agentic-rag-system",
      "thumbnail": "thumbnail_png/proj1_thumb.png",
      "github": "https://github.com/nmman5404/MiniChatBot",
      "href": "projects/Agentic_RAG_System/Agentic_RAG_System.html",
      "tags": [
        "LangGraph",
        "LangChain",
        "Hugging Face",
        "Python"
      ],
      "locales": {
        "en": {
          "title": "Agentic RAG System",
          "summary": "Built agentic RAG pipeline with LangGraph/LangChain, enabling contextual retrieval, multi-turn state, and improved reliability via guardrails.",
          "alt": "description"
        },
        "vi": {
          "title": "Hệ thống Agentic RAG",
          "summary": "Xây dựng luồng xử lý RAG với LangGraph/LangChain, hỗ trợ truy xuất theo ngữ cảnh, ghi nhớ trạng thái đa lượt và cải thiện độ tin cậy thông qua guardrails.",
          "alt": "Agentic RAG System Thumbnail"
        }
      }
    },
    {
      "id": "Agentic_MCP",
      "articleId": "agentic-mcp",
      "thumbnail": "thumbnail_png/proj2_thumb.png",
      "github": "https://github.com/nmman5404/MCP_Agent",
      "href": "projects/Agentic_MCP/Agentic_MCP.html",
      "tags": [
        "LangGraph",
        "MCP",
        "Python",
        ".NET"
      ],
      "locales": {
        "en": {
          "title": "AI-Driven Inventory Manager",
          "summary": "Designed AI agent system (Python, LangGraph) integrated with .NET via MCP, ensuring reliability and security with N-tier architecture.",
          "alt": "description"
        },
        "vi": {
          "title": "Quản lý Kho hàng tích hợp AI",
          "summary": "Thiết kế hệ thống AI Agent (Python, LangGraph) kết nối với .NET thông qua giao thức MCP, đảm bảo tính ổn định và bảo mật với kiến trúc N-tier.",
          "alt": "AI-Driven Inventory Manager Thumbnail"
        }
      }
    },
    {
      "id": "Skin_Cancer_Detection",
      "articleId": "skin-cancer-detection",
      "thumbnail": "thumbnail_png/proj3_thumb.png",
      "github": "https://github.com/nmman5404/Deep-Learning-Approaches-for-Skin-Cancer-Detection-and-Segmentation",
      "href": "projects/Skin_Cancer_Detection/Skin_Cancer_Detection.html",
      "tags": [
        "MMDetection",
        "PyTorch",
        "Python"
      ],
      "locales": {
        "en": {
          "title": "Deep Learning Approaches for Skin Cancer Detection and Segmentation",
          "summary": "Benchmarked 13 detection models on 16.9K images, improving mAP@50 to 76.2% and recall to 84.3% via optimization techniques.",
          "alt": "description"
        },
        "vi": {
          "title": "Học sâu trong Nhận diện và Phân vùng Ung thư Da",
          "summary": "Đánh giá 13 mô hình nhận diện trên 16.9K hình ảnh, cải thiện chỉ số mAP@50 lên 76.2% và recall lên 84.3% qua các kỹ thuật tối ưu hóa.",
          "alt": "Skin Cancer Detection Thumbnail"
        }
      }
    },
    {
      "id": "Fake_News_Detection",
      "articleId": "fake-news-detection",
      "thumbnail": "thumbnail_png/proj4_thumb.png",
      "github": "https://github.com/nmman5404/Fake-News-Detection-with-a-BERT-XLNet-Hybrid-Model",
      "href": "projects/Fake_News_Detection/Fake_News_Detection.html",
      "tags": [
        "PyTorch",
        "Hugging Face",
        "Python"
      ],
      "locales": {
        "en": {
          "title": "Fake News Detection with a BERT-XLNet Hybrid Model",
          "summary": "Built hybrid NLP classifier (BERT + XLNet) with dynamic gating, processing 78K+ articles and achieving 90.42% accuracy, 91.63% recall.",
          "alt": "description"
        },
        "vi": {
          "title": "Phát hiện Tin giả bằng Mô hình Lai BERT-XLNet",
          "summary": "Xây dựng mô hình phân loại NLP lai (BERT + XLNet) kết hợp cơ chế Dynamic Gating, xử lý hơn 78K đoạn văn bản và đạt độ chính xác 90.42%, độ nhạy 91.63%.",
          "alt": "Fake News Detection Thumbnail"
        }
      }
    },
    {
      "id": "Diabetes_Health_Indicator_Analysis",
      "articleId": "diabetes-health-indicator-analysis",
      "thumbnail": "thumbnail_png/proj5_thumb.png",
      "github": "https://github.com/nmman5404/Diabetes-Health-Indicator-Analysis",
      "href": "projects/Diabetes_Health_Indicator_Analysis/Diabetes_Health_Indicator_Analysis.html",
      "tags": [
        "scikit-learn",
        "XGBoost",
        "Seaborn",
        "Python"
      ],
      "locales": {
        "en": {
          "title": "Diabetes Health Indicator Analysis",
          "summary": "Performed EDA and statistical testing on 253K+ records, handling imbalance and achieving 94.7% precision with XGBoost.",
          "alt": "description"
        },
        "vi": {
          "title": "Phân tích Chỉ số đường huyết",
          "summary": "Thực hiện EDA và kiểm định thống kê trên 253K+ hồ sơ, xử lý tình trạng mất cân bằng dữ liệu và đạt precision 94.7% với thuật toán XGBoost.",
          "alt": "Diabetes Health Indicator Thumbnail"
        }
      }
    },
    {
      "id": "Agentic_Stock_Forecasting_System",
      "articleId": "agentic-stock-forecasting-system",
      "thumbnail": "thumbnail_png/proj6_thumb.png",
      "github": "https://github.com/nmman5404/agentic_stock_forecasting_system",
      "href": "projects/Agentic_Stock_Forecasting_System/Agentic_Stock_Forecasting_System.html",
      "tags": [
        "scikit-learn",
        "XGBoost",
        "LangGraph",
        "Python"
      ],
      "locales": {
        "en": {
          "title": "Agentic Stock Forecasting System",
          "summary": "A production-ready MLOps system designed to forecast stock returns and autonomously manage model degradation without human intervention.",
          "alt": "description"
        },
        "vi": {
          "title": "Hệ thống Agentic Dự báo Chứng khoán ",
          "summary": "Hệ thống MLOps thông minh được xây dựng để dự báo xu hướng lợi nhuận cổ phiếu và tự động phát hiện, xử lý sự suy giảm hiệu năng mô hình mà không cần can thiệp thủ công.",
          "alt": "description"
        }
      }
    }
  ],
  "labels": {
    "en": {
      "heading": "Featured Projects",
      "github": "View GitHub Repo",
      "details": "Read More",
      "pagination": "Project pages",
      "previous": "Previous project page",
      "next": "Next project page",
      "page": "Page",
      "of": "of"
    },
    "vi": {
      "heading": "Dự án Nổi bật",
      "github": "Xem GitHub",
      "details": "Chi Tiết",
      "pagination": "Phân trang dự án",
      "previous": "Trang dự án trước",
      "next": "Trang dự án sau",
      "page": "Trang",
      "of": "/"
    }
  }
};
