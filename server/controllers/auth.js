const config = require('../config/auth')
const Role = require('../models/role')
const User = require('../models/user')
const { response } = require('../classes')
const { controllers: { auth: STRINGS } = {} } = require('../MAGIC_STRINGS')
const sendMail = require('../utils/sendMail')
const { randomInt } = require('node:crypto')

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

exports.signup = async (req, res) => {
  const { email, password, roles, username } = req.body
  const expiresIn = 86400 // 24 hours

  try {
    const authCode =
      randomInt(1000_000_000).toString().padStart(12, '0') + randomInt(1000_000_000).toString().padStart(12, '0')

    const user = new User({
      authCode,
      email,
      password: bcrypt.hashSync(password, 8),
      username
    })

    await user.save(async (err, user) => {
      if (err) {
        return res.status(200).send(new response.fail(err))
      }

      if (roles) {
        Role.find({ name: { $in: roles } }, async err => {
          // this part should be updated if the user roles should not be chosen from users
          if (err) {
            return res.status(200).send(new response.fail(err))
          }

          user.roles = roles.map(role => role._id)
          await user.save((err, user) => {
            if (err) {
              return res.status(200).send(new response.fail(err))
            }

            // signin(req, res) // if everything is ok, we are gonna signin automatically
            // we disabled this feature for now since the user should be active first to be loged in
            const token = jwt.sign({ id: user._id }, config.secret, {
              expiresIn
            })
            res.status(200).send(
              new response.success({
                id: user._id,
                email,
                roles,
                username: user.username,
                accessToken: token
              })
            )
          })
        })
      } else {
        let name = 'user'

        await User.countDocuments({}, (err, count) => {
          if (err) {
            return response.failed(res, err)
          } else if (count === 1) {
            name = 'admin'
          } // if there is no user), the first one will be automatically an admin and the isActive will be true
        })

        Role.findOne({ name }, async (err, role) => {
          if (err) {
            return res.status(200).send(new response.fail(err))
          }

          user.roles = [role._id]
          await user.save(err => {
            if (err) {
              return res.status(200).send(new response.fail(err))
            }

            // signin(req, res) // if everything is ok, we are gonna signin automatically
            // we disabled this feature for now since the user should be active first to be loged in
            const token = jwt.sign({ id: user._id }, config.secret, {
              expiresIn
            })
            res.status(200).send(
              new response.success({
                id: user._id,
                email,
                roles,
                username: user.username,
                accessToken: token
              })
            )
          })
        })
      }
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.signin = (req, res) => {
  User.findOne({
    $or: [
      { username: req.body?.username },
      { email: req.body?.username },
      { username: req.body?.email },
      { email: req.body?.email }
    ]
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        return res.status(200).send(new response.fail(err))
      }

      if (!user) {
        return response.failed(res, `${STRINGS.userNotFound} or ${STRINGS.invalidPassword}`)
      }

      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

      if (!passwordIsValid) {
        return response.failed(res, `${STRINGS.userNotFound} or ${STRINGS.invalidPassword}`)
      }

      const { id, email, roles, username } = user // we will send the user data except password
      let expiresIn = 86400 // 24 hours

      if (req.body.remember === true) {
        expiresIn *= 100 // it will be 100 days
      }

      const token = jwt.sign({ id }, config.secret, {
        expiresIn
      })

      res.status(200).send(
        new response.success({
          id,
          email,
          roles,
          username,
          accessToken: token
        })
      )
    })
}

exports.activate = async (req, res) => {
  const { email, authCode } = req.body

  try {
    await User.findOne({ email }, async (err, user) => {
      if (err) {
        return res.status(200).send(new response.fail(err))
      }

      if (!user || user.authCode !== authCode) {
        return response.failed(res, `${STRINGS.userNotFound} / ${STRINGS.invalidAuthCode}`)
      }


      user.authCode = null

      await user.save(err => {
        if (err) {
          return res.status(200).send(new response.fail(err))
        }

        return response.successed(res, null, STRINGS.userActivated)
      })
    })
  } catch (error) {
    console.log(error.message)
  }
}