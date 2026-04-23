Feature: Todo application

  The user should be able to manage tasks by creating, editing, completing, deleting and filtering them

  Background:
    Given the user opens the todo application and the task list is empty

  @smoke
  Scenario: Application loads successfully
    Then the input for new tasks is visible

  @smoke @creation
  Scenario: Create a new task
    When the user adds a task named "Wash the car"
    Then the task "Wash the car" is visible in the list
    And the task "Wash the car" is active
    And the counter shows "1 item left"

  @creation
  Scenario: Create multiple tasks with the same name
    When the user adds a task named "Read Psychology of Money"
    And the user adds a task named "Read Psychology of Money"
    Then 2 tasks named "Read Psychology of Money" are visible in the list
    And the counter shows "2 items left"

  @negative @creation
  Scenario Outline: Do not allow creating tasks with invalid names
    When the user tries to add a task using "<inputType>" input
    Then no task is added

    Examples:
      | inputType            |
      | empty                |
      | single whitespace    |
      | multiple whitespace  |

  @smoke @completion
  Scenario: Mark an active task as completed
    Given the user has a task named "Practice double unders"
    When the user marks the task "Practice double unders" as completed
    Then the task "Practice double unders" is completed
    And the counter shows "0 items left"

  @completion
  Scenario: Mark a completed task as active
    Given the user has a task named "Evening dog walk with Lara"
    And the user marks the task "Evening dog walk with Lara" as completed
    When the user marks the task "Evening dog walk with Lara" as active
    Then the task "Evening dog walk with Lara" is active
    And the counter shows "1 item left"

  @completion
  Scenario: Mark all tasks as completed
    Given the user has multiple active tasks
    When the user marks all tasks as completed
    Then all tasks are completed
    And the counter shows "0 items left"

  @completion
  Scenario: Mark all tasks as active
    Given the user has multiple completed tasks
    When the user marks all tasks as active
    Then all tasks are active

  @editing
  Scenario: Edit an existing task
    Given the user has a task named "Study chess openings"
    When the user changes the task "Study chess openings" to "Review chess game"
    Then the task "Review chess game" is visible in the list
    And the task "Study chess openings" is not visible in the list

  @editing
  Scenario: Edit a task with an empty value
    Given the user has a task named "Hike Vodno mountain"
    When the user clears the task name for "Hike Vodno mountain" and saves
    Then the task "Hike Vodno mountain" is not visible in the list

  @smoke @deletion
  Scenario: Delete a task
    Given the user has a task named "Finish AMRAP workout"
    When the user deletes the task "Finish AMRAP workout"
    Then the task "Finish AMRAP workout" is not visible in the list

  @filtering
  Scenario: Filter active tasks
    Given the user has both active and completed tasks
    When the user selects the "Active" filter
    Then only active tasks are visible

  @filtering
  Scenario: Filter completed tasks
    Given the user has both active and completed tasks
    When the user selects the "Completed" filter
    Then only completed tasks are visible

  @filtering
  Scenario: Show all tasks
    Given the user has multiple tasks
    When the user selects the "All" filter
    Then all tasks are visible

  @clear-completed
  Scenario: Clear completed tasks
    Given the user has completed tasks
    When the user clears completed tasks
    Then only active tasks remain

  @persistence
  Scenario: Tasks stay after refresh
    Given the user has a task named "Do 50 burpees"
    When the user refreshes the page
    Then the task "Do 50 burpees" is visible in the list

  @bug @persistence
  Scenario: Empty task list stays empty after refresh
    When the user refreshes the page
    Then no tasks are displayed