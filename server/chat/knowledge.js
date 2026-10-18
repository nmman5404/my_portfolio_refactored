import fs from 'node:fs';
import path from 'node:path';

/** Read on every request, preserving the original route's fallback behavior. */
export function readKnowledge({
    cwd = process.cwd,
    readFile = fs.readFileSync,
    logger = console,
} = {}) {
    const knowledgePath = path.join(cwd(), 'api', 'knowledge.md');

    try {
        return readFile(knowledgePath, 'utf8');
    } catch (error) {
        logger.error('Không tìm thấy file knowledge.md', error);
        return 'Lỗi: Không tải được thông tin CV.';
    }
}
