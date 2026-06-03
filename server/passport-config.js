import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "node:crypto";
import { getUserByUsername, getUserById } from "./dao.js";

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await getUserByUsername(username);
            
            if (!user)
                return done(null, false, { message: 'Invalid credentials.' });
            
            // recompute hash with the stored salt and compare
            const inputHash = crypto.scryptSync(password, user.salt, 64).toString('hex');
            
            const isValid = crypto.timingSafeEqual(
                Buffer.from(inputHash, 'hex'),
                Buffer.from(user.password,'hex')
            );
            
            if (!isValid)
                return done(null, false, { message: 'Invalid credentials.' });
            
            return done(null, { id: user.id, username: user.username });
        } catch (err) {
            return done(err);
        }
    }
));

// SERIALIZE / DESERIALIZE
// serializeUser
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserializeUser
passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserById(id);
        if (!user)
            return done(null, false);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;