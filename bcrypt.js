const hashedPassword = await bcryptjs.hash(password, 10);
const passwordMatch = await bcryptjs.compare(password, existingUser.password);
