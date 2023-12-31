USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Lessons_Insert]    Script Date: 5/6/2023 7:09:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Amanda Totin
-- Create date: 4/10/2023
-- Description: Inserts new record into dbo.Lessons table
-- Code Reviewer: Miguel Munoz

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


CREATE Proc [dbo].[Lessons_Insert]
		@Id int OUTPUT,
		@SiteTrainingId int,
		@Title nvarchar(50),
		@Subject nvarchar(50),
		@Summary nvarchar(200),
		@Duration nvarchar(50),
		@CoverImageUrl nvarchar(250),
		@LessonTypeId int,
		@CreatedBy int,
		@MediaUrl nvarchar(250)
		

AS

/*

		DECLARE @Id int = 0,
				@SiteTrainingId int = 2,
				@Title nvarchar(50) = 'test',
				@Subject nvarchar(50) = 'test',
				@Summary nvarchar(200) = 'test',
				@Duration nvarchar(50) = 'test',
				@CoverImageUrl nvarchar(250) = 'test',
				@LessonTypeId int = 1,
				@CreatedBy int = 13,
				@MediaUrl nvarchar(250) = 'test'
				


		Execute [dbo].[Lessons_Insert]
				@Id OUTPUT,
				@SiteTrainingId,
				@Title,
				@Subject,
				@Summary,
				@Duration,
				@CoverImageUrl,
				@LessonTypeId,
				@CreatedBy
				@MediaUrl
			


		SELECT *
		FROM dbo.Lessons
		WHERE Id = @Id

*/

BEGIN
		INSERT INTO
			[dbo].[Lessons] (
					[SiteTrainingId],
					[Title],
					[Subject],
					[Summary],
					[Duration],
					[CoverImageUrl],
					[LessonTypeId],
					[CreatedBy],
					[ModifiedBy],
					[MediaUrl]
					
					)
			VALUES
					(@SiteTrainingId,
					@Title,
					@Subject,
					@Summary,
					@Duration,
					@CoverImageUrl,
					@LessonTypeId,
					@CreatedBy,
					@CreatedBy,
					@MediaUrl
					
					);

			SET @Id = SCOPE_IDENTITY();

END
GO
