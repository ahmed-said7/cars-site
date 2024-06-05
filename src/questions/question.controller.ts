import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { Protected } from "src/guards/protect.user";
import { AuthUser } from "src/decorator/current.user";
import { UserDoc } from "src/schema.factory/user.schema";
import { ParseMongoId } from "src/pipes/validate.mogoid";
import { QuestionService } from "./question.service";
import { CreateContactDto } from "./dto/create.contact.dto";
import { CreateQuestionDto } from "./dto/create.question.dto";
import { UpdateQuestionDto } from "./dto/update.question.dto";
import { mongodbId } from "src/chat/chat.service";
import { allowedToGuard } from "src/guards/allowed.user";
import { Roles } from "src/decorator/metadata";
import { userType } from "src/enums/user.type";


@Controller()
export class QuestionController {
    constructor( private questionService:QuestionService ){};
    @Post("contact")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    createContact(
        @Body() body:CreateContactDto
    ){
        return this.questionService.addContact(body);
    };
    @Get("contact")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin,userType.user)
    getAllContact(){
        return this.questionService.getAllContacts();
    };
    @Post("question")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    createQuestion(
        @Body() body:CreateQuestionDto,
        @AuthUser() user:UserDoc
    ){
        return this.questionService.createQuestion(body,user);
    };
    @Get("question")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin,userType.user)
    getAllQuestions(){
        return this.questionService.getAllQuestions();
    };
    @Delete("question/:questionId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    deleteQuestion(
        @Param("questionId",ParseMongoId) questionId:mongodbId,
        @AuthUser() user:UserDoc
    ){
        return this.questionService.deleteQuestion(questionId,user);
    };
    @Patch("question/:questionId")
    @UseGuards(Protected,allowedToGuard)
    @Roles(userType.admin)
    updateQuestion(
        @Param("questionId",ParseMongoId) questionId:mongodbId,
        @AuthUser() user:UserDoc,
        @Body() body:UpdateQuestionDto
    ){
        return this.questionService.updateQuestion(body,questionId,user);
    };
}