USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[UserLogins_SelectByUserId_Paginated]    Script Date: 5/12/2023 1:58:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Eonju Cheong>
-- Create date: <5/8/2023>
-- Description: <A paginated record for user login. Recent shown on the top.>
--
-- Code Reviewer:
-- =============================================

CREATE PROC [dbo].[UserLogins_SelectByUserId_Paginated]
						@PageIndex int
					   ,@PageSize int
				       ,@UserId int

AS
/*
DECLARE @PageIndex int = 0
       ,@PageSize int = 30;

DECLARE @UserId int = 577


EXECUTE [dbo].[UserLogins_SelectByUserId_Paginated]
						@PageIndex
					   ,@PageSize
					   ,@UserId

					   select * from [dbo].[UserLogins]

					

*/
BEGIN

	DECLARE @offset int = @PageIndex * @PageSize

	SELECT ul.[Id]
		  ,ul.[UserId]
		  ,u.[FirstName]
		  ,u.[LastName]
		  ,u.[Mi]
		  ,u.[AvatarUrl]
		  ,ul.Email
		  ,ul.IPAddress
		  ,ul.DateLoggedIn
		  ,TotalCount = COUNT(1) OVER()
      FROM [dbo].[UserLogins] as ul
	  INNER JOIN [dbo].[Users] as u
	  ON u.Id = ul.UserId AND u.Email = ul.Email
	  WHERE [UserId] = @UserId

	  ORDER BY ul.[Id] DESC

	  OFFSET @offSet Rows
	  Fetch Next @PageSize Rows ONLY;

END
GO
