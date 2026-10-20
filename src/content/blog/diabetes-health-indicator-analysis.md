---
title: "Project Diabetes Health Indicator Analysis\r\n    "
slug: "diabetes-health-indicator-analysis"
kind: "project"
preset: "project"
permalink: "/projects/Diabetes_Health_Indicator_Analysis/Diabetes_Health_Indicator_Analysis.html"
---

<main class="max-w-4xl mx-auto px-6 pt-32 pb-20">

<!-- Header Bài viết -->
<div class="mb-10 text-center">
<p class="text-blue-600 dark:text-blue-500 font-mono mb-3">Project Case Study</p>
<h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
Diabetes Health Indicator Analysis
</h1>
<div class="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
<span>Nguyễn Minh Mẫn, Ngô Kim Ngọc, Nguyễn Thị Yến Linh, Nguyễn Ngọc Tuyết Nhi</span>
</div>
<div class="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
<span>2025</span>
</div>
</div>

<!-- Ảnh Hero (Banner chính) -->
<div class="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden mb-12 shadow-lg">
<img src="proj5_banner.png" alt="Project Banner" class="w-full h-full object-cover">
</div>

<!-- Khung Nội Dung Text -->
<article class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">

<!-- Nội dung -->
<article class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">

<!-- Tổng quan -->

## Tổng quan

Tiểu đường hiện là một trong những bệnh lý mạn tính phổ biến và nguy hiểm nhất trên toàn cầu. Theo nhiều nghiên cứu y tế, phần lớn bệnh nhân thường chỉ được phát hiện khi bệnh đã tiến triển hoặc xuất hiện biến chứng liên quan đến tim mạch, thần kinh và thận. Điều này khiến việc phát hiện sớm các nhóm có nguy cơ cao trở thành một bài toán đặc biệt quan trọng trong y học dự phòng hiện đại.

Trong thực tế, dữ liệu sức khỏe cộng đồng thường tồn tại nhiều vấn đề như: mất cân bằng dữ liệu nghiêm trọng, nhiễu thống kê, đặc trưng y tế chồng chéo giữa các nhóm bệnh, cũng như sự khác biệt lớn giữa các hành vi sinh hoạt và yếu tố nhân khẩu học. Điều này khiến việc xây dựng các hệ thống dự đoán bệnh bằng Machine Learning trở nên khó khăn hơn nhiều so với các bài toán classification thông thường.

Dự án này tập trung xây dựng một hệ thống phân tích nguy cơ tiểu đường dựa trên bộ dữ liệu Behavioral Risk Factor Surveillance System (BRFSS), kết hợp giữa Data Analysis, Statistical Testing và Machine Learning nhằm phát hiện sớm các cá nhân thuộc nhóm: Không tiểu đường, Tiền tiểu đường và Tiểu đường.

Thay vì chỉ tối ưu Accuracy tổng thể, nghiên cứu ưu tiên góc nhìn medical screening — nơi Recall cho các nhóm nguy cơ cao đóng vai trò quan trọng hơn nhằm giảm thiểu khả năng bỏ sót bệnh nhân.

<!-- Công nghệ -->

## Các công cụ và công nghệ

- **Ngôn ngữ lập trình:** Python
- **Phân tích dữ liệu:** Pandas, NumPy
- **Trực quan hóa:** Matplotlib, Seaborn
- **Machine Learning:** Scikit-learn, XGBoost
- **Các mô hình sử dụng:** Logistic Regression, Random Forest, XGBoost
- **Kỹ thuật xử lý dữ liệu:** Feature Scaling, Label Encoding, Class Balancing
- **Đánh giá mô hình:** Precision, Recall, F1-score, Confusion Matrix
- **Môi trường thực thi:** Jupyter Notebook, VS Code

<!-- Bộ dữ liệu -->

## Bộ dữ liệu BRFSS

Dự án sử dụng bộ dữ liệu Behavioral Risk Factor Surveillance System (BRFSS), một trong những hệ thống khảo sát sức khỏe cộng đồng lớn nhất tại Hoa Kỳ, được thu thập bởi Centers for Disease Control and Prevention (CDC).

Dataset bao gồm nhiều thông tin liên quan đến: tình trạng sức khỏe, thói quen sinh hoạt, hoạt động thể chất, tiền sử bệnh lý và yếu tố nhân khẩu học. Các đặc trưng này cho phép mô hình học được mối liên hệ giữa hành vi sống và nguy cơ phát triển bệnh tiểu đường.

Sau quá trình tiền xử lý, dữ liệu được chia thành ba nhóm mục tiêu chính:

- Không tiểu đường
- Tiền tiểu đường
- Tiểu đường

Một trong những thách thức lớn nhất của dataset là hiện tượng class imbalance nghiêm trọng, khi nhóm Tiền tiểu đường chiếm tỷ lệ rất thấp so với phần còn lại. Điều này khiến mô hình dễ thiên lệch về lớp majority và bỏ sót các trường hợp nguy cơ thực sự.

<!-- EDA -->

## Phân tích dữ liệu khám phá (EDA)

Trước khi huấn luyện mô hình, dữ liệu được phân tích nhằm tìm hiểu đặc điểm phân bố, tương quan giữa các đặc trưng và các yếu tố có ảnh hưởng mạnh đến nguy cơ tiểu đường.

Quá trình EDA tập trung vào:

- Phân bố class và mức độ mất cân bằng dữ liệu
- Ảnh hưởng của BMI đến nguy cơ bệnh
- Tác động của tuổi tác và hoạt động thể chất
- Mối liên hệ giữa huyết áp cao, cholesterol và tiểu đường
- Phân tích correlation giữa các đặc trưng y tế

Kết quả cho thấy các đặc trưng như BMI cao, tuổi lớn, ít vận động, huyết áp cao và tiền sử bệnh tim có tương quan đáng kể với nguy cơ mắc tiểu đường.

<!-- Placeholder Image -->
<div class="flex justify-center my-8">
<div class="w-full max-w-3xl">

<img src="proj5_correlation.png" alt="EDA Visualization" class="w-full rounded-xl shadow-md border border-gray-200 dark:border-gray-700">

<p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
Sự tương quan giữa các đặc trưng y tế và nguy cơ tiểu đường.
</p>

</div>
</div>

<!-- Statistical Analysis -->

## Phân tích thống kê và kiểm định giả thuyết

Ngoài các kỹ thuật trực quan hóa, dự án còn áp dụng các phương pháp kiểm định thống kê nhằm đánh giá mức độ ảnh hưởng của từng đặc trưng lên biến mục tiêu.

Các kiểm định được sử dụng bao gồm:

- Chi-Square Test cho các biến phân loại
- ANOVA và t-test cho các biến liên tục
- Correlation Analysis giữa các feature y tế

Kết quả kiểm định cho thấy nhiều biến có ý nghĩa thống kê mạnh đối với nguy cơ tiểu đường, đặc biệt là BMI, HighBP, HighChol và Age.

<!-- Pipeline -->

## Pipeline Machine Learning

Sau bước phân tích dữ liệu, pipeline Machine Learning được xây dựng nhằm dự đoán nguy cơ tiểu đường dựa trên các đặc trưng sức khỏe và hành vi sống.

Quy trình huấn luyện bao gồm:

- Làm sạch và chuẩn hóa dữ liệu
- Feature scaling cho các biến liên tục
- Chia train/test set
- Xử lý mất cân bằng dữ liệu
- Huấn luyện và benchmark nhiều mô hình
- Đánh giá bằng confusion matrix và classification metrics

Nghiên cứu tập trung so sánh ba hướng tiếp cận chính:

- **Logistic Regression:** baseline model dễ diễn giải và phù hợp cho dữ liệu y tế.
- **Random Forest:** ensemble learning giúp giảm overfitting và cải thiện khả năng tổng quát hóa.
- **XGBoost:** boosting-based architecture mạnh trong xử lý dữ liệu structured và class imbalance.

<!-- Kết quả -->

## Kết quả thực nghiệm

Các mô hình được đánh giá dựa trên nhiều metric khác nhau nhằm phản ánh đầy đủ hiệu năng trong bối cảnh dữ liệu y tế mất cân bằng.

Thay vì chỉ tối ưu Accuracy, nghiên cứu tập trung nhiều hơn vào Recall và F1-score cho các nhóm nguy cơ cao nhằm giảm khả năng bỏ sót bệnh nhân.

Phân tích chi tiết theo từng class cho thấy mỗi mô hình đều có những ưu điểm riêng trong việc xử lý các nhóm bệnh khác nhau.

<ul class="list-disc pl-5 space-y-3">

<li>
<strong>Logistic Regression:</strong>
đạt Precision = 93.8%, Recall = 65.8% và F1-score = 77.3%
trên nhóm <strong>Không tiểu đường</strong>.
Đối với nhóm <strong>Tiền tiểu đường</strong>,
mô hình đạt Precision = 3.2%, Recall = 24.7% và F1-score = 5.7%,
trong khi ở nhóm <strong>Tiểu đường</strong>,
mô hình đạt Precision = 35.4%, Recall = 61.2% cùng F1-score = 44.8%.
Logistic Regression cho khả năng diễn giải tốt,
tuy nhiên còn gặp hạn chế khi xử lý dữ liệu mất cân bằng mạnh.
</li>

<li>
<strong>Random Forest:</strong>
đạt Precision = 93.9%, Recall = 63.9% và F1-score = 76.0%
trên nhóm <strong>Không tiểu đường</strong>.
Với nhóm <strong>Tiền tiểu đường</strong>,
mô hình đạt Precision = 3.1%, Recall = 21.7% và F1-score = 5.4%.
Trong khi đó,
Random Forest đạt Recall cao nhất ở nhóm <strong>Tiểu đường</strong>
với Precision = 34.1%, Recall = 65.7% và F1-score = 44.9%.
</li>

<li>
<strong>XGBoost:</strong>
đạt Precision = 94.7%, Recall = 60.9% và F1-score = 74.1%
trên nhóm <strong>Không tiểu đường</strong>.
Đối với nhóm <strong>Tiền tiểu đường</strong>,
mô hình đạt Precision = 3.1%, Recall cao nhất = 31.8%,
mặc dù F1-score vẫn còn thấp ở mức 5.7%
do ảnh hưởng của class imbalance nghiêm trọng.
Ở nhóm <strong>Tiểu đường</strong>,
XGBoost đạt Precision = 35.8%, Recall = 62.2% và F1-score = 45.4% — cao nhất trong ba mô hình,
cho thấy XGBoost có xu hướng phát hiện tốt hơn các nhóm bệnh nguy cơ cao.
</li>

</ul>

Tuy nhiên, khi so sánh tổng thể thông qua Accuracy, Macro Average và Weighted Average, sự khác biệt giữa ba mô hình không quá lớn. Điều này cho thấy mỗi mô hình đều có sự đánh đổi riêng giữa khả năng tổng quát hóa và hiệu năng trên từng nhóm bệnh.

<!-- Bảng kết quả -->
<div class="overflow-x-auto my-8">

<table class="min-w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">

<thead class="bg-gray-100 dark:bg-gray-800">

<tr>

<th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
Mô hình
</th>

<th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
Accuracy
</th>

<th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
Macro Precision
</th>

<th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
Macro Recall
</th>

<th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
Macro F1-score
</th>

</tr>

</thead>

<tbody class="divide-y divide-gray-200 dark:divide-gray-700">

<!-- Logistic Regression -->
<tr class="bg-white dark:bg-gray-900">

<td class="px-4 py-3">
Logistic Regression
</td>

<td class="px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400">
0.64
</td>

<td class="px-4 py-3 text-center">
0.44
</td>

<td class="px-4 py-3 text-center">
0.50
</td>

<td class="px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400">
0.43
</td>

</tr>

<!-- Random Forest -->
<tr class="bg-gray-50 dark:bg-gray-800/40">

<td class="px-4 py-3">
Random Forest
</td>

<td class="px-4 py-3 text-center">
0.63
</td>

<td class="px-4 py-3 text-center">
0.44
</td>

<td class="px-4 py-3 text-center">
0.50
</td>

<td class="px-4 py-3 text-center">
0.42
</td>

</tr>

<!-- XGBoost -->
<tr class="bg-white dark:bg-gray-900">

<td class="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
XGBoost
</td>

<td class="px-4 py-3 text-center">
0.60
</td>

<td class="px-4 py-3 text-center font-semibold text-green-600 dark:text-green-400">
0.45
</td>

<td class="px-4 py-3 text-center font-semibold text-green-600 dark:text-green-400">
0.51
</td>

<td class="px-4 py-3 text-center">
0.42
</td>

</tr>

</tbody>

</table>

</div>

<!-- Thách thức -->

## Thách thức và giải pháp

- **Mất cân bằng dữ liệu nghiêm trọng:** Nhóm Tiền tiểu đường chiếm tỷ lệ rất thấp, khiến mô hình dễ bỏ sót các trường hợp nguy cơ. Các kỹ thuật balancing và tuning threshold được áp dụng nhằm cải thiện Recall.
- **Đặc trưng y tế chồng chéo:** Nhiều đặc trưng giữa các nhóm bệnh có phân bố gần giống nhau, làm tăng độ khó cho bài toán classification đa lớp.
- **Trade-off giữa Precision và Recall:** Trong bối cảnh medical screening, việc tăng Recall thường kéo theo nhiều false positive hơn. Dự án ưu tiên phát hiện được người có nguy cơ thay vì tối ưu Accuracy tuyệt đối.
- **Khả năng diễn giải mô hình:** Các mô hình boosting mạnh như XGBoost có hiệu năng cao nhưng khó diễn giải hơn Logistic Regression trong môi trường y tế.

<!-- Hướng phát triển -->

## Hướng phát triển

Dự án có thể được mở rộng theo nhiều hướng nhằm cải thiện độ chính xác và khả năng ứng dụng thực tế:

- Áp dụng Deep Learning cho dữ liệu y tế structured.
- Sử dụng SMOTE hoặc advanced resampling techniques cho class imbalance.
- Tối ưu hyperparameter bằng Bayesian Optimization hoặc Optuna.
- Mở rộng dữ liệu cho nhiều nhóm dân số và khu vực khác nhau.

<div class="mt-12 flex justify-center">
<a href="https://github.com/nmman5404/Diabetes-Health-Indicator-Analysis"
target="_blank"
class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/40">
Xem mã nguồn trên GitHub
</a>
</div>

</article>
</main>
