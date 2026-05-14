import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Res,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocumentService } from '../services/document.service';
import { UploadDocumentDto, DocumentCategory } from '../dto/upload-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Public } from '../../../common/decorators/public.decorator';
import { Multer } from 'multer';

@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all documents' })
    async getAll(@Query('category') category?: DocumentCategory) {
        return this.documentService.getAllDocuments(category);
    }

    @Public()
    @Get('categories')
    @ApiOperation({ summary: 'Get document categories' })
    async getCategories() {
        return this.documentService.getCategories();
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get document by ID' })
    async getById(@Param('id') id: string) {
        return this.documentService.getDocumentById(id);
    }

    @Public()
    @Get(':id/download')
    @ApiOperation({ summary: 'Download document' })
    async download(@Param('id') id: string, @Res() res: Response) {
        const { stream, fileName, contentType } = await this.documentService.downloadDocument(id);

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

        stream.pipe(res);
    }

    @UseGuards(AdminGuard)
    @Post('upload')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload a new document (Admin only)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
                title: { type: 'string' },
                description: { type: 'string' },
                category: { type: 'string', enum: ['regulations', 'volleyball_rules', 'referee_rules', 'other'] },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UploadDocumentDto,
        @Req() req: any,
    ) {
        return this.documentService.uploadDocument(file, dto, req.user.id);
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update document (Admin only)' })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateDocumentDto,
        @Req() req: any,
    ) {
        return this.documentService.updateDocument(id, dto, req.user.id);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete document (Admin only)' })
    async delete(@Param('id') id: string) {
        return this.documentService.deleteDocument(id);
    }
}