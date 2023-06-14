const bcrypt = require('bcrypt');
const constant = require('./constant')
const saltRounds = constant['SALT'];

module.exports = {
    /** convert plain password into secure password */
    'hashPassword' : (password) => {
        const salt = bcrypt
                        .genSaltSync(
                            saltRounds
                        );

        const hash = bcrypt
                        .hashSync(
                            password,
                            salt
                        );
        return [hash,salt];
    },

    /** compare hash password with plain password*/
    'checkPassword' : (password, hash) => {
        return bcrypt
                .compareSync(
                    password,
                    hash
                );
    }

}