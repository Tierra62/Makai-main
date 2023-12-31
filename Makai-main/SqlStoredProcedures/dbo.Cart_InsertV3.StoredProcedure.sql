USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Cart_InsertV3]    Script Date: 5/1/2023 2:09:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: Jacob Fathal
-- Create date: 04/27/2023
-- Description: Insert into [dbo].[Cart]
-- Code Reviewer:

-- MODIFIED BY: 
-- MODIFIED DATE: 
-- Code Reviewer:
-- Note: Nullify "StartTime" and "EndTime" columns
-- =============================================



CREATE proc [dbo].[Cart_InsertV3]

				@ProductId int
				,@Quantity int
				,@CreatedBy int
				,@ModifiedBy int
				,@Id int OUTPUT

				,@StartTime	datetime2(7) = null
				,@EndTime datetime2(7) = null


/*=======================================================
						TEST CODE

	DECLARE @Id int = 0

	DECLARE	@ProductId int = 46
			,@Quantity int = 4
			,@CreatedBy int =577
			,@ModifiedBy int = 577

	EXECUTE dbo.Cart_InsertV3
							@ProductId
							,@Quantity
							,@CreatedBy
							,@ModifiedBy
							,@Id OUTPUT

	SELECT *
		FROM [dbo].[Cart]
		WHERE Id = @Id

=======================================================*/

as

BEGIN

	INSERT INTO [dbo].[Cart]
				([ProductId]
				,[Quantity]
				,[StartTime]
				,[EndTime]
				,[CreatedBy]
				,[ModifiedBy])
			VALUES
				(@ProductId
				,@Quantity
				,@StartTime
				,@EndTime
				,@CreatedBy
				,@ModifiedBy)

			SET @Id = SCOPE_IDENTITY()

END
GO
