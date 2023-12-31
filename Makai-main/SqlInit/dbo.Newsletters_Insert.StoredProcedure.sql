USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Newsletters_Insert]    Script Date: 5/6/2023 6:46:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Torin Harthcock
-- Create date: 10 April 2023

-- Description: Inserts new record into [dbo].[Newsletters]

-- Code Reviewer:

-- MODIFIED BY:
-- MODIFIED DATE: 
-- Code Reviewer:
-- Note: 
-- =============================================


CREATE PROC [dbo].[Newsletters_Insert]
		@TemplateId int
	   ,@Name nvarchar(100)
	   ,@CoverPhoto nvarchar(255) = NULL
	   ,@DateToPublish datetime2(7) = NULL
	   ,@DateToExpire datetime2(7) = NULL
	   ,@CreatedBy int
	   ,@BatchNewsletterContent dbo.BatchNewsletterContent READONLY
	   ,@Id int OUTPUT







/*TEST CODE (run this execute section to test out proc without accessing execute file)

DECLARE @Id int = 0;

DECLARE @TemplateId int = 3
	   ,@Name nvarchar(100) = 'some other name'
	   ,@CoverPhoto nvarchar(255) = 'https://m.media-amazon.com/images/M/MV5BMjE0MTY2NjQwMV5BMl5BanBnXkFtZTcwODczMDUzMw@@._V1_UY100_CR39,0,100,100_AL_.jpg'
	   ,@DateToPublish datetime2(7) = NULL
	   ,@DateToExpire datetime2(7) = NULL
	   ,@CreatedBy int = 8
	   ,@BatchNewsletterContent dbo.BatchNewsletterContent


	   Insert into @BatchNewsletterContent( id, Content)
	   Values(5, 'some header text will go here')
	   Insert into @BatchNewsletterContent( id, Content)
	   Values(6, 'A bunch of main text will go here')


EXECUTE [dbo].[Newsletters_Insert]
						 @TemplateId
						,@Name
						,@CoverPhoto
						,@DateToPublish
						,@DateToExpire
						,@CreatedBy
						,@BatchNewsletterContent
						,@Id OUTPUT

SELECT *
FROM [dbo].[Newsletters] as Newsletters inner join dbo.NewsletterContent as NewsletterContent
on Newsletters.Id = NewsletterContent.NewsletterId
WHERE Newsletters.Id = @Id;

*/

AS 

BEGIN


INSERT INTO [dbo].[Newsletters]
           (
           [TemplateId]
           ,[Name]
           ,[CoverPhoto]
           ,[DateToPublish]
           ,[DateToExpire]
           ,[CreatedBy]
		   )
     VALUES
           (
		   @TemplateId
		   ,@Name 
		   ,@CoverPhoto
		   ,@DateToPublish
		   ,@DateToExpire 
		   ,@CreatedBy 
		   )
	SET @Id = SCOPE_IDENTITY(); --return the most recent IDENTITY value inserted in the same scope

	INSERT INTO dbo.NewsletterContent(Value, TemplateKeyId, NewsletterId, CreatedBy)

	select 
			BatchContent.Content,
			BatchContent.id,
			@Id,
			@CreatedBy

	From @BatchNewsletterContent as BatchContent

END;
GO
