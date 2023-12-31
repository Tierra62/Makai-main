USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Lessons_Update]    Script Date: 5/6/2023 7:09:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Amanda Totin
-- Create date: 4/10/2023
-- Description: Updates record in dbo.Lessons table
-- Code Reviewer: Miguel Munoz

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


CREATE Proc [dbo].[Lessons_Update]
		@Id int,
		@SiteTrainingId int,
		@Title nvarchar(50),
		@Subject nvarchar(50),
		@Summary nvarchar(200),
		@Duration nvarchar(50),
		@CoverImageUrl nvarchar(250),
		@LessonTypeId int,
		@ModifiedBy int,
		@MediaUrl nvarchar(250)
		
AS

/*

		DECLARE @Id int = 2,
				@SiteTrainingId int = 1,
				@Title nvarchar(50) = 'Updated 123 test',
				@Subject nvarchar(50) = 'updated test',
				@Summary nvarchar(200) = 'test',
				@Duration nvarchar(50) = 'test',
				@CoverImageUrl nvarchar(250) = 'test',
				@LessonTypeId int = 1,
				@ModifiedBy int = 12,
				@MediaUrl nvarchar(250) = 'test'
				

		SELECT *
		FROM [dbo].[Lessons]
		WHERE Id = @Id;

		Execute [dbo].[Lessons_Update]
				@Id,
				@SiteTrainingId,
				@Title,
				@Subject,
				@Summary,
				@Duration,
				@CoverImageUrl,
				@LessonTypeId,
				@ModifiedBy,
				@MediaUrl
				

		SELECT *
		FROM [dbo].[Lessons]
		WHERE Id = @Id;

*/

BEGIN
		UPDATE [dbo].[Lessons]
		SET	[SiteTrainingId] = @SiteTrainingId,
			[Title] = @Title,
			[Subject] = @Subject,
			[Summary] = @Summary,
			[Duration] = @Duration,
			[CoverImageUrl] = @CoverImageUrl,
			[LessonTypeId] = @LessonTypeId,
			[ModifiedBy] = @ModifiedBy,
			[DateModified] = GETUTCDATE(),
			[MediaUrl] = @MediaUrl
			WHERE Id = @Id

END
GO
