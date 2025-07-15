/**
 * @swagger
 * /update-image:
 *   post:
 *     summary: Обновляет версию Docker-образа
 *     description: Вызывает сервис, обновляющий версии образов в GitHub
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - version
 *             properties:
 *               image:
 *                 type: string
 *                 example: nginx
 *               version:
 *                 type: string
 *                 example: 1.25.2
 *     responses:
 *       200:
 *         description: Обновление успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       400:
 *         description: Отсутствует image или version
 *       500:
 *         description: Ошибка сервера
 */
export {};