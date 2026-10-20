---
title: "Project Deep Learning Approaches for Skin Cancer Detection and Segmentation\r\n    "
slug: "skin-cancer-detection"
kind: "project"
preset: "project"
permalink: "/projects/Skin_Cancer_Detection/Skin_Cancer_Detection.html"
---

<main class="max-w-4xl mx-auto px-6 pt-32 pb-20">

<!-- Header Bài viết -->
<div class="mb-10 text-center">
<p class="text-blue-600 dark:text-blue-500 font-mono mb-3">Project Case Study</p>
<h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
Deep Learning Approaches for Skin Cancer Detection and Segmentation
</h1>
<div class="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
<span>Nguyễn Minh Mẫn, Vũ Diệu Minh, Nguyễn Ngọc Tuyết Nhi</span>
</div>
<div class="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
<span>2026</span>
</div>
</div>

<!-- Ảnh Hero (Banner chính) -->
<div class="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden mb-12 shadow-lg">
<img src="proj3_banner.png" alt="Project Banner" class="w-full h-full object-cover">
</div>

<!-- Khung Nội Dung Text -->
<article class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">

<!-- Nội dung -->
<article class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">

<!-- Tổng quan -->

## Tổng quan

Ung thư da hiện là một trong những loại ung thư phổ biến nhất trên toàn cầu, đặc biệt là Melanoma — dạng ung thư có khả năng di căn nhanh và tỷ lệ tử vong cao nếu không được phát hiện sớm. Trong thực tế lâm sàng, quá trình phát hiện tổn thương da thường phụ thuộc mạnh vào chuyên môn bác sĩ da liễu và các thiết bị soi da chuyên dụng.

Tuy nhiên, phần lớn các hệ thống AI hiện tại chỉ hoạt động tốt trên các ảnh soi da (dermoscopy) đã được crop sẵn quanh tổn thương (lesion-centric images), trong khi môi trường thực tế thường chứa rất nhiều thành phần gây nhiễu như lông, nếp gấp da, ánh sáng không đồng đều và nhiều tổn thương xuất hiện cùng lúc.

Báo cáo seminar này tập trung xây dựng một hệ thống phát hiện tổn thương da tự động bằng Deep Learning trên bộ dữ liệu iToBoS — một dataset được trích xuất từ ảnh chụp toàn thân 3D (3D Total Body Photography), iToBoS giữ nguyên ngữ cảnh rộng của vùng da xung quanh nhằm mô phỏng sát hơn điều kiện sàng lọc thực tế.

Nghiên cứu tiến hành benchmark nhiều kiến trúc Object Detection hiện đại như YOLOv8, YOLOv9, YOLOv10, RetinaNet và Faster R-CNN nhằm đánh giá sự đánh đổi giữa tốc độ, độ chính xác và khả năng phát hiện tổn thương nhỏ trong môi trường y tế phức tạp.

<!-- Công nghệ -->

## Các công cụ và công nghệ

- **Ngôn ngữ lập trình:** Python
- **Framework / Thư viện:** PyTorch, MMDetection, Ultralytics YOLO, OpenCV, NumPy, Pandas, Matplotlib
- **Mô hình Deep Learning:** YOLOv8, YOLOv9, YOLOv10, RetinaNet, Faster R-CNN
- **Backbone được sử dụng:** CSPDarknet, RegNetX-800MF, ResNet-50, ResNeXt-101
- **Kỹ thuật huấn luyện:** Focal Loss, Mixed Precision Training (AMP), Gradient Scaling, Multi-scale Training
- **Phần cứng:** NVIDIA RTX 3060 12GB, Kaggle Tesla P100/T4

<!-- Dataset -->

## Bộ dữ liệu iToBoS

Hệ thống được huấn luyện trên bộ dữ liệu iToBoS (Intelligent Total Body Scanner), một dataset công khai được xây dựng dành riêng cho bài toán phát hiện tổn thương da trong ảnh toàn thân 3D.

Bộ dữ liệu bao gồm hơn 16 900 ảnh vùng da độ phân giải cao được trích xuất từ hệ thống chụp ảnh toàn thân VECTRA WB360. Mỗi ảnh chứa ngữ cảnh rộng xung quanh tổn thương thay vì chỉ crop riêng lesion như các dataset dermoscopy truyền thống.

Dữ liệu được annotate dưới dạng bounding box cho tất cả các vùng nghi ngờ tổn thương nhằm phục vụ bài toán object detection. Bộ dữ liệu cũng chứa nhiều tình huống khó như:

- Nhiều tổn thương xuất hiện đồng thời trong một ảnh
- Ánh sáng và góc chụp không đồng đều
- Nhiễu từ lông, vải, nếp gấp da và vùng da lành
- Tổn thương nhỏ với ranh giới mờ
- Mất cân bằng dữ liệu nghiêm trọng giữa benign và malignant lesions (tổn thương lành tính và ác tính).

Tổng cộng dataset chứa khoảng 60 000 annotations với trung bình 4–5 lesions trên mỗi ảnh. Dữ liệu được chia train/ test theo bệnh nhân nhằm tránh hiện tượng data leakage trong quá trình đánh giá mô hình.

<!-- Kiến trúc -->

## Kiến trúc mô hình Object Detection

Nghiên cứu tập trung đánh giá hai hướng tiếp cận chính trong bài toán object detection: One-stage detectors và Two-stage detectors.

Nhóm One-stage bao gồm các biến thể YOLOv8, YOLOv9 và YOLOv10. Các mô hình này trực tiếp dự đoán bounding box và class chỉ trong một lần suy luận, giúp đạt tốc độ inference rất cao và phù hợp cho các hệ thống thời gian thực.

Trong khi đó, nhóm Two-stage được xây dựng dựa trên Faster R-CNN. Kiến trúc này chia quá trình detection thành hai bước: đề xuất vùng nghi ngờ (Region Proposal) và tinh chỉnh phân loại/hộp giới hạn. Điều này giúp cải thiện đáng kể khả năng phát hiện các tổn thương nhỏ hoặc khó nhận biết.

Ngoài các mô hình baseline phổ biến, nhóm còn xây dựng nhiều custom architectures sử dụng các backbone mạnh như RegNetX-800MF và ResNeXt-101 kết hợp với:

- Feature Pyramid Network (FPN)
- Double Head R-CNN
- Focal Loss cho class imbalance
- ConvFC Bounding Box Head

Các kiến trúc này được thiết kế nhằm tối ưu hóa khả năng phát hiện tổn thương trong dữ liệu y tế phức tạp, nơi Recall và độ ổn định thường quan trọng hơn tốc độ suy luận thuần túy.

<!-- Training -->

## Quy trình huấn luyện

Các mô hình được huấn luyện trên cả môi trường local workstation và Kaggle GPU environment nhằm tối ưu thời gian thực nghiệm.

Quá trình huấn luyện sử dụng batch size từ 2–16 tùy theo kích thước mô hình và VRAM khả dụng. Kích thước ảnh đầu vào dao động từ 640 đến 1024 nhằm đánh giá ảnh hưởng của độ phân giải lên khả năng phát hiện tổn thương nhỏ.

Một số kỹ thuật tối ưu được áp dụng xuyên suốt quá trình training:

- Automatic Mixed Precision (AMP)
- Gradient Scaling
- Data Augmentation đa tỷ lệ

Các mô hình được đánh giá bằng bộ metric chuẩn COCO bao gồm: Precision, Recall, mAP@50 và mAP@50–95. Ngoài ra, Average Recall theo kích thước đối tượng cũng được phân tích nhằm đánh giá khả năng phát hiện lesion nhỏ.

<!-- Kết quả -->

## Kết quả đạt được

Sau quá trình huấn luyện và benchmark trên bộ dữ liệu iToBoS, nghiên cứu cho thấy cả hai hướng tiếp cận One-stage và Two-stage Object Detection đều đạt được kết quả tích cực trong bài toán phát hiện tổn thương da.

Các mô hình YOLO thế hệ mới nổi bật nhờ tốc độ huấn luyện nhanh, khả năng hội tụ tốt và hiệu năng tổng thể khá cao trên dữ liệu ảnh toàn thân. Trong số đó, YOLOv9-Medium đạt kết quả cân bằng tốt nhất giữa Precision, Recall và mAP.

<div class="flex justify-center my-8">
<div class="w-full max-w-2xl">
<img src="proj3_yolov9Result.jpg" alt="YOLOv9 Results"
class="w-full rounded-xl shadow-md border border-gray-200 dark:border-gray-700">

<p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
Các đường chỉ số huấn luyện và validation của YOLOv9-Medium trên bộ dữ liệu iToBoS.
</p>
</div>
</div>

- **YOLOv9-Medium:** đạt kết quả mAP@50–95 tốt nhất trong nhóm YOLO với Precision = 73.2%, Recall = 65.7%, mAP@50 = 74.7% và mAP@50–95 = 41.4%.
- **YOLOv10-Large:** đạt Precision cao nhất trong nhóm YOLO (75.5%), cho thấy khả năng giảm false positive khá hiệu quả.
- **Custom Model 1 (Faster R-CNN + RegNetX-800MF + FPN + Focal Loss):** đạt mAP@50 cao nhất = 76.2% và mAP@50–95 = 40.3%, cho thấy khả năng localization rất ổn định trong môi trường y tế phức tạp.
- **Custom Model 2 (Faster R-CNN + ResNeXt-101 + Double Head R-CNN):** đạt Recall cao nhất = 84.3%, giúp giảm nguy cơ bỏ sót tổn thương — yếu tố đặc biệt quan trọng trong bài toán sàng lọc ung thư da.
- **Custom Model 3 (Faster R-CNN + ResNet-50 + ConvFC Bounding Box Head):** đạt Recall = 73.5% và mAP@50 = 72.7%, đóng vai trò như một baseline two-stage detector ổn định với chi phí huấn luyện thấp hơn.

Kết quả thực nghiệm cho thấy YOLO phù hợp cho các hệ thống cần tốc độ suy luận cao hoặc triển khai thời gian thực, trong khi Faster R-CNN lại cho hiệu suất ổn định hơn khi xử lý các tổn thương nhỏ và dữ liệu có độ nhiễu cao.

<!-- Bảng kết quả YOLO -->
<div class="overflow-x-auto my-8">

<table class="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">

<thead class="bg-gray-100 dark:bg-gray-800">

<tr>

<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
Mô hình
</th>

<th class="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
Precision
</th>

<th class="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
Recall
</th>

<th class="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
mAP@50
</th>

<th class="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
mAP@50–95
</th>

</tr>

</thead>

<tbody class="divide-y divide-gray-200 dark:divide-gray-700">

<tr class="bg-white dark:bg-gray-900">
<td class="px-6 py-4">YOLOv8-Small</td>
<td class="px-6 py-4 text-center">0.661</td>
<td class="px-6 py-4 text-center">0.602</td>
<td class="px-6 py-4 text-center">0.665</td>
<td class="px-6 py-4 text-center">0.362</td>
</tr>

<tr class="bg-gray-50 dark:bg-gray-800/40">
<td class="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">YOLOv9-Medium</td>
<td class="px-6 py-4 text-center font-semibold text-blue-600 dark:text-blue-400">0.732
</td>
<td class="px-6 py-4 text-center font-semibold text-blue-600 dark:text-blue-400">0.657
</td>
<td class="px-6 py-4 text-center font-semibold text-blue-600 dark:text-blue-400">0.747
</td>
<td class="px-6 py-4 text-center font-semibold text-blue-600 dark:text-blue-400">0.414
</td>
</tr>

<tr class="bg-white dark:bg-gray-900">
<td class="px-6 py-4">YOLOv8-Large</td>
<td class="px-6 py-4 text-center">0.718</td>
<td class="px-6 py-4 text-center">0.633</td>
<td class="px-6 py-4 text-center">0.725</td>
<td class="px-6 py-4 text-center">0.401</td>
</tr>

<tr class="bg-white dark:bg-gray-900">
<td class="px-6 py-4">YOLOv10-Small</td>
<td class="px-6 py-4 text-center">0.729</td>
<td class="px-6 py-4 text-center">0.635</td>
<td class="px-6 py-4 text-center">0.728</td>
<td class="px-6 py-4 text-center">0.399</td>
</tr>

<tr class="bg-gray-50 dark:bg-gray-800/40">
<td class="px-6 py-4">YOLOv10-Medium</td>
<td class="px-6 py-4 text-center">0.665</td>
<td class="px-6 py-4 text-center">0.598</td>
<td class="px-6 py-4 text-center">0.662</td>
<td class="px-6 py-4 text-center">0.352</td>
</tr>

<tr class="bg-white dark:bg-gray-900">
<td class="px-6 py-4">YOLOv10-Large</td>
<td class="px-6 py-4 text-center">0.755</td>
<td class="px-6 py-4 text-center">0.602</td>
<td class="px-6 py-4 text-center">0.717</td>
<td class="px-6 py-4 text-center">0.395</td>
</tr>

</tbody>

</table>

</div>

<!-- Bảng kết quả Custom Architectures -->
<div class="overflow-x-auto my-8">

<table
class="w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden text-sm">

<thead class="bg-gray-100 dark:bg-gray-800">

<tr>

<th class="px-3 py-3 text-left font-semibold text-gray-900 dark:text-white">
Kiến trúc
</th>

<th class="px-3 py-3 text-center font-semibold text-gray-900 dark:text-white">
Precision
</th>

<th class="px-3 py-3 text-center font-semibold text-gray-900 dark:text-white">
Recall
</th>

<th class="px-3 py-3 text-center font-semibold text-gray-900 dark:text-white">
mAP@50
</th>

<th class="px-3 py-3 text-center font-semibold text-gray-900 dark:text-white">
mAP@50–95
</th>

</tr>

</thead>

<tbody class="divide-y divide-gray-200 dark:divide-gray-700">

<tr class="bg-white dark:bg-gray-900">

<td class="px-3 py-3">
RegNetX + FPN + Focal
</td>

<td class="px-3 py-3 text-center">
0.608
</td>

<td class="px-3 py-3 text-center">
0.777
</td>

<td class="px-3 py-3 text-center font-bold text-blue-600 dark:text-blue-400">
0.762
</td>

<td class="px-3 py-3 text-center font-bold text-blue-600 dark:text-blue-400">
0.403
</td>

</tr>

<tr class="bg-gray-50 dark:bg-gray-800/40">

<td class="px-3 py-3">
ResNeXt-101 + Double Head
</td>

<td class="px-3 py-3 text-center font-bold text-green-600 dark:text-green-400">
0.446
</td>

<td class="px-3 py-3 text-center font-bold text-green-600 dark:text-green-400">
0.843
</td>

<td class="px-3 py-3 text-center">
0.735
</td>

<td class="px-3 py-3 text-center">
0.332
</td>

</tr>

<tr class="bg-white dark:bg-gray-900">

<td class="px-3 py-3">
ResNet50 + ConvFC
</td>

<td class="px-3 py-3 text-center">
0.445
</td>

<td class="px-3 py-3 text-center">
0.735
</td>

<td class="px-3 py-3 text-center">
0.727
</td>

<td class="px-3 py-3 text-center">
0.328
</td>
</tr>
</tbody>
</table>
</div>

<!-- Thách thức -->

## Thách thức và giải pháp

- **Class imbalance nghiêm trọng:** Phần lớn tổn thương trong dataset là benign lesions (tổn thương lành tính) khiến mô hình dễ bias về background. Vấn đề này được giải quyết bằng Focal Loss và điều chỉnh sampling strategy.
- **Tổn thương kích thước nhỏ:** Nhiều lesion chỉ chiếm diện tích rất nhỏ trong ảnh toàn thân. Việc tăng img\_size lên 1024 giúp cải thiện đáng kể khả năng localization.
- **Nhiễu từ môi trường thực tế:** Lông, nếp gấp da, ánh sáng và quần áo thường bị mô hình nhầm với tổn thương. Data augmentation và backbone mạnh hơn giúp cải thiện tính tổng quát hóa.
- **Giới hạn tài nguyên GPU:** Các mô hình large-scale như ResNeXt-101 và YOLOv10-Large tiêu tốn rất nhiều VRAM. AMP và huấn luyện trên Kaggle GPU được sử dụng để giảm tải bộ nhớ.

<!-- Hướng phát triển -->

## Hướng phát triển

Trong tương lai, nghiên cứu có thể được mở rộng theo nhiều hướng nhằm nâng cao hiệu năng và khả năng ứng dụng thực tế:

- Áp dụng Vision Transformer hoặc Swin Transformer cho object detection.
- Xây dựng ensemble models giữa YOLO và Faster R-CNN.
- Tối ưu hyperparameter bằng Optuna hoặc Bayesian Optimization.
- Tích hợp Explainable AI để hỗ trợ bác sĩ giải thích dự đoán.
- Mở rộng dataset cho nhiều skin tone khác nhau nhằm tăng khả năng tổng quát hóa.
- Xây dựng hệ thống CAD hỗ trợ sàng lọc ung thư da trong môi trường cộng đồng.

<div class="mt-12 flex justify-center">
<a data-article-repo href="https://github.com/nmman5404/Deep-Learning-Approaches-for-Skin-Cancer-Detection-and-Segmentation"
target="_blank"
class="glass-optional glass-control glass-pill glass-accent px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/40">
Xem mã nguồn trên GitHub
</a>
</div>

</article>
</main>
