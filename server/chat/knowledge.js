import fs from 'node:fs';
import path from 'node:path';

/** The handler caches this deployment's knowledge after the first read. */
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
