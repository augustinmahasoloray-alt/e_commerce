const { PrismaClient } = require ("@prisma/client");
const bcrypt = require ("bcrypt");
const prisma = new PrismaClient();

async function main () {
	console.log("debut du seed");
	const password1 = await bcrypt.hash("augustin04g",10);
	const user1 = await prisma.user.create({
		data: {
			nom: "Augustin",
			prenom: "Onjaniaina",
			email: "augusinmahasoloray@gmail.com",
			mot_de_passe_hash: password1,
			telephone: "0387941600",
			role: "client",
		},
		});
	console.log('User1 crée');
}

main()
.catch((error) => {
	console.error("Erreur pendant le seed:", error);
	process.exit(1);
})
.finally(async () =>{
	await prisma.$disconnect();
});
