USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Lessons_SelectAll]    Script Date: 5/6/2023 7:09:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Amanda Totin
-- Create date: 4/10/2023
-- Description: Selects all records from dbo.Lessons table
-- Code Reviewer: Miguel Munoz

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[Lessons_SelectAll]
			@PageIndex int,
			@PageSize int
		

AS

/*

		Declare 
				@PageIndex int = 0,
				@PageSize int = 5

		EXECUTE [dbo].[Lessons_SelectAll] 
											
											@PageIndex,
											@PageSize

*/

BEGIN

		DECLARE @offset int = @PageIndex * @PageSize

		SELECT l.Id,
			   l.SiteTrainingId,
			   st.Title,
			   l.Title,
			   l.Subject,
			   l.Summary,
			   l.Duration,
			   l.CoverImageUrl,
			   l.LessonTypeId,
			   l.CreatedBy,
			   us.FirstName as CreatorFirstName,
			   us.LastName,
			   us.Mi,
			   us.AvatarUrl,
			   l.ModifiedBy,
			   ur.FirstName as ModifierFirstName,
			   ur.LastName,
			   ur.Mi,
			   ur.AvatarUrl,
			   l.DateCreated,
			   l.DateModified,
			   l.MediaUrl,
		TotalCount = COUNT(1) OVER() 
		FROM [dbo].[Lessons] AS l
		INNER JOIN [dbo].[Users] AS us
		ON l.CreatedBy = us.Id
		INNER JOIN [dbo].[Users] AS ur
		ON l.ModifiedBy = ur.Id
		INNER JOIN [dbo].[LessonTypes] AS lt
		ON l.LessonTypeId = lt.Id
		INNER JOIN [dbo].[SiteTrainings] AS st
		ON l.SiteTrainingId = st.id
		ORDER BY l.Id
		OFFSET @offset Rows
		Fetch Next @PageSize Rows ONLY
		
END
				
GO
