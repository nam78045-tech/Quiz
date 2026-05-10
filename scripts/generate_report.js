
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import fs from 'fs';

const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                new Paragraph({
                    text: 'BÁO CÁO CHI TIẾT DỰ ÁN: QUIZ.APP',
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: '\nNgày báo cáo: ' + new Date().toLocaleDateString('vi-VN'),
                            bold: true,
                        }),
                    ],
                }),
                new Paragraph({
                    text: '\n1. TỔNG QUAN DỰ ÁN',
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                    text: 'Quiz.App là một nền tảng quản lý và luyện tập trắc nghiệm trực tuyến, được thiết kế với phong cách Neo-Brutalism hiện đại, tập trung vào trải nghiệm người dùng nhanh chóng và hiệu quả.',
                }),
                new Paragraph({
                    text: '\n2. CÔNG NGHỆ SỬ DỤNG',
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: '- Frontend:', bold: true }),
                        new TextRun({ text: ' React 18, Vite, TypeScript.' }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: '- Styling:', bold: true }),
                        new TextRun({ text: ' Tailwind CSS (Custom Theme: Neo-Brutalism).' }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: '- Backend & Database:', bold: true }),
                        new TextRun({ text: ' Firebase (Firestore, Authentication).' }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: '- Animations:', bold: true }),
                        new TextRun({ text: ' Framer Motion (Motion/React).' }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: '- Icons:', bold: true }),
                        new TextRun({ text: ' Lucide-React.' }),
                    ],
                }),
                new Paragraph({
                    text: '\n3. CÁC TÍNH NĂNG CHÍNH',
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({ text: '• Quản lý môn học (Subjects): Cho phép tạo, xóa và tìm kiếm các chủ đề câu hỏi.' }),
                new Paragraph({ text: '• Quản lý câu hỏi (Question Management):' }),
                new Paragraph({ text: '  - Thêm câu hỏi thủ công hoặc nhập liệu thô (Smart Parse).' }),
                new Paragraph({ text: '  - Chỉnh sửa và xóa câu hỏi linh hoạt.' }),
                new Paragraph({ text: '• Chế độ làm bài Quiz:' }),
                new Paragraph({ text: '  - Giao diện trực quan, hiển thị kết quả ngay lập tức khi chọn đáp án.' }),
                new Paragraph({ text: '  - Tổng kết điểm số sau khi hoàn thành.' }),
                new Paragraph({ text: '• Hệ thống Auth: Đăng nhập an toàn qua Google Login (Firebase Auth).' }),
                new Paragraph({ text: '• Theme: Hỗ trợ Light Mode và Dark Mode với phong cách thiết kế độc đáo.' }),
                new Paragraph({
                    text: '\n4. CẤU TRÚC DỮ LIỆU (FIRESTORE)',
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({ text: '• Collection "subjects": Lưu tên môn học, người tạo, ngày tạo.' }),
                new Paragraph({ text: '• Collection "questions": Lưu nội dung câu hỏi, 4 đáp án (A,B,C,D), đáp án đúng, ID môn học tương ứng.' }),
                new Paragraph({
                    text: '\n5. HƯỚNG DẪN TRIỂN KHAI (DEPLOY)',
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({ text: 'Dự án đã được cấu hình sẵn để triển khai lên Google Cloud Run hoặc Firebase Hosting thông qua hệ thống AI Studio Build. Người dùng chỉ cần lưu thay đổi lên kho lưu trữ và quá trình build sẽ diễn ra tự động.' }),
                new Paragraph({
                    text: '\n6. KẾT LUẬN',
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({ text: 'Quiz.App không chỉ là một công cụ học tập mà còn là minh chứng cho sự kết hợp giữa thiết kế tối giản và công nghệ đám mây hiện đại. Hệ thống dễ dàng mở rộng thêm các tính năng như thi đấu trực tuyến hoặc phân tích kết quả chuyên sâu.' }),
            ],
        },
    ],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync('QuizApp_ProjectReport.docx', buffer);
    console.log('Report generated successfully: QuizApp_ProjectReport.docx');
});
