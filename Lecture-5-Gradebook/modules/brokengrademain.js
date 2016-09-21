$(function() {
  var gradebook = Gradebook();

  gradebook.addStudent("George");
  gradebook.addStudent("Diane");
  gradebook.addStudent("Thor");
  gradebook.addStudent("Lisa");
  gradebook.addStudent("Catherine");
  gradebook.addStudent("Sven");
  gradebook.addAssignment("JavaScript Warm-Up");
  gradebook.addAssignment("Prefix Match");
  gradebook.addAssignment("Game of Life");
  gradebook.addAssignment("Fritter Part 1");
  gradebook.addAssignment("Fritter Part 2");
  gradebook.addAssignment("Data Models");
  gradebook.addAssignment("Concept Design");
  gradebook.setGrade("Sven", "JavaScript Warm-Up", 15);
  gradebook.setGrade("Sven", "JavaScript Warm-Up", 30);
  gradebook.setGrade("Catherine", "JavaScript Warm-Up", 16);
  gradebook.setGrade("Catherine", "Fritter Part 1", 90);

  GradeWidget_install($("#grades_by_assignment"), gradebook, true);
  GradeWidget_install($("#grades_by_student"), gradebook, true);
})

