const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLBoolean,
} = require("graphql");

const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime,
} = require("graphql-iso-date");

const bcrypt = require("bcrypt");
const saltRound = 12;
const authController = require("../controllers/authController");

const member = require("../models/memberModel");
const event = require("../models/eventModel");

const memberType = new GraphQLObjectType({
  name: "member",
  fields: () => ({
    id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    organization: { type: GraphQLString },
    token: { type: GraphQLString },
  }),
});

const eventType = new GraphQLObjectType({
  name: "event",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    date: { type: GraphQLDateTime },
    location: { type: GraphQLString },
    attendees: {
      type: new GraphQLList(memberType),
      resolve(parent, args) {
        return member.find({ _id: { $in: parent.attendees } });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    allMembers: {
      type: new GraphQLList(memberType),
      description: "Get all members",
      resolve(parent, args) {
        return member.find();
      },
    },
    memberById: {
      type: memberType,
      description: "Gets a member by id",
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, args) => {
        return await member.findById(args.id);
      },
    },
    allEvents: {
      type: new GraphQLList(eventType),
      description: "Get all events",
      resolve: async(parent, args) => {
        //await authController.checkAuth(req,res)
        return event.find();
      },
    },
    event: {
      type: eventType,
      description: "Get an event by id",
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return event.findById(args.id);
      },
    },
    login: {
      type: memberType,
      description: "Login and username and password, returns token",
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args, { req, res }) => {
        console.log("Login");
        req.body = {
          ...args,
          username: args.email
        };
        try {
          const authResponse = await authController.login(req, res);
          return {
            id: authResponse.user._id,
            ...authResponse.user,
            token: authResponse.token,
          };
        } catch (err) {
          throw new Error(err);
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  fields: () => ({
    registerMember: {
      type: memberType,
      description: "Register member",
      args: {
        firstname: { type: new GraphQLNonNull(GraphQLString) },
        lastname: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        organization: { type: GraphQLString },
      },
      resolve: async (parent, args, { req, res }) => {
        try {
          const hash = await bcrypt.hash(args.password, saltRound);
          const hashedMember = {
            ...args,
            password: hash,
          };
          const newMember = new member(hashedMember);
          const result = await newMember.save();
          if (result !== null) {
            // automatic login
            req.body = {
              ...args,
              username: args.email,
            }; // inject args to request body for passport
            const authResponse = await authController.login(req, res);
            return {
              id: authResponse.user._id,
              ...authResponse.user,
              token: authResponse.token,
            };
          } else {
            throw new Error('insert fail');
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    addEvent: {
      type: eventType,
      description: "Add new event",
      args: {
        location: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLDateTime) },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args, { req, res }) => {
        try {
          await authController.checkAuth(req, res);
          let checkExistingEvent = await event.findOne({ name: args.name });
          if (!checkExistingEvent) {
            let newEvent = new event(args);
            return newEvent.save();
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    attendeeCheckIn: {
      type: eventType,
      description: "Check attendees into the event",
      args: {
        attendeeId: { type: GraphQLID },
        eventId: { type: GraphQLID },
      },
      resolve: async (parent, args) => {
        try {
          let attendingMember = await (
            await member.findById(args.attendeeId)
          ).toObject();
          //delete attendingMember.password;
          return await event.findByIdAndUpdate(
            args.eventId,
            { $addToSet: { attendees: attendingMember._id } },
            { new: true }
          );
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    deleteEvent: {
      type: eventType,
      description: "Delete an event by ID",
      args: {
        eventId: { type: GraphQLID },
      },
      resolve: async (parent, args) => {
        try {
          await authController.checkAuth(req, res);
          let eventToDelete = await event.findByIdAndDelete(args.eventId);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    modifyEvent: {
      type: eventType,
      description: "Modify an event",
      args: {
        eventId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        location: { type: GraphQLString },
        time: { type: GraphQLDateTime },
      },
      resolve: async (parent, args) => {
        try {
          await authController.checkAuth(req, res);
          let updatedEvent = {
            name: args.name,
            location: args.location,
            time: args.time,
          };
          return await event.findByIdAndUpdate(args.eventId, updatedEvent);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    modifyUser: {
      type: eventType,
      description: "Modify a user",
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        organization: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        try {
          let updatedUser = {
            firstname: args.firstname,
            lastname: args.lastname,
            email: args.email,
            organization: args.organization,
          };
          return await member.findByIdAndUpdate(args.userId, updatedUser);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
