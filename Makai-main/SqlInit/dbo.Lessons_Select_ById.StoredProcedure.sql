USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Lessons_Select_ById]    Script Date: 5/6/2023 7:09:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Amanda Totin
-- Create date: 4/10/2023
-- Description: Selects a record by Id from dbo.Lessons table
-- Code Reviewer: Miguel Munoz

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[Lessons_Select_ById]
		@Id int

AS

/*

		Declare @Id int = 3

		EXECUTE [dbo].[Lessons_Select_ById] @Id

*/

BEGIN

		SELECT l.Id,
			   l.SiteTrainingId,
			   l.Title,
			   l.Subject,
			   l.Summary,
			   l.Duration,
			   l.CoverImageUrl,
			   l.LessonTypeId,
			   l.CreatedBy,
			   us.FirstName, 
			   us.LastName,
			   us.Mi,
			   us.AvatarUrl,
			   l.ModifiedBy,
			   ur.FirstName, 
			   ur.LastName,
			   ur.Mi,
			   ur.AvatarUrl,
			   l.DateCreated,
			   l.DateModified,
			   l.MediaUrl

		FROM [dbo].[Lessons] AS l
		INNER JOIN [dbo].[Users] AS us
		ON l.CreatedBy = us.Id
		INNER JOIN [dbo].[Users] AS ur
		ON l.ModifiedBy = ur.Id
		INNER JOIN [dbo].[LessonTypes] AS lt
		ON l.LessonTypeId = lt.Id

		WHERE l.Id = @Id

END
				
GO
