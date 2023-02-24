import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import crypto, { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoutes(app: FastifyInstance) {

	app.get("/", {
		preHandler: [checkSessionIdExists],
	}, async (request) => {
		const { sessionId } = request.cookies;

		const transactions = await knex("transactions").select().where("session_id", sessionId);
		return {
			transactions
		};
	});  

	app.get("/summary", {
		preHandler: [checkSessionIdExists],
	}, async (request) => {
		const { sessionId } = request.cookies;

		const summary = await knex("transactions").sum("amount", {as: "Amount"}).first().where({
			session_id: sessionId
		});


		return {
			summary
		};
	});

	app.get("/:id", {
		preHandler: [checkSessionIdExists],
	}, async (request) => {
		const getTransactionParamsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = getTransactionParamsSchema.parse(request.params);
		const { sessionId } = request.cookies;

		const transaction = await knex("transactions").where({
			id,
			session_id: sessionId
		}).first();

		return {
			transaction
		};
	});

	app.post("/", async (request, response) => {
		const createTransactionBodyScheme = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(["credit", "debit"])
		});

		const { title, amount, type } = createTransactionBodyScheme.parse(request.body);

		let sessionId = request.cookies.sessionId;

		if (!sessionId) {
			sessionId = randomUUID();

			response.setCookie("sessionId", sessionId, {
				path: "/",
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
			});
		}

		await knex("transactions").insert({
			id: crypto.randomUUID(),
			title,
			amount: type === "credit" ? amount: amount * -1,
			session_id: sessionId
		});


		return response.status(201).send();
	});
}