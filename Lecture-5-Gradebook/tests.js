QUnit.test("Simple gradebook tests", function(assert) {
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
  assert.deepEqual(gradebook.getStudents(),
    ["George", "Diane", "Thor", "Lisa", "Catherine", "Sven"]);
  assert.deepEqual(gradebook.getAssignments(), [
    "JavaScript Warm-Up", "Prefix Match", "Game of Life", "Fritter Part 1",
    "Fritter Part 2", "Data Models", "Concept Design"]);
  assert.equal(gradebook.getGrade("George", "Prefix Match"), 0);
  assert.raises(function () {
    gradebook.getGrade("George2", "Prefix Match");
  });
  assert.raises(function () {
    gradebook.getGrade("George", "Prefix Match2");
  });
  gradebook.setGrade("Sven", "JavaScript Warm-Up", 15);
  assert.equal(gradebook.getGrade("Sven", "JavaScript Warm-Up"), 15);
  gradebook.setGrade("Sven", "JavaScript Warm-Up", 30);
  assert.equal(gradebook.getGrade("Sven", "JavaScript Warm-Up"), 30);
  gradebook.setGrade("Catherine", "JavaScript Warm-Up", 16);
  assert.equal(gradebook.getGrade("Catherine", "JavaScript Warm-Up"), 16);
  assert.equal(gradebook.getGrade("Sven", "JavaScript Warm-Up"), 30);
  gradebook.setGrade("Catherine", "Fritter Part 1", 90);
  assert.equal(gradebook.getGrade("Catherine", "JavaScript Warm-Up"), 16);
  assert.equal(gradebook.getGrade("Catherine", "Fritter Part 1"), 90);
  assert.equal(gradebook.getGrade("Sven", "JavaScript Warm-Up"), 30);
  assert.equal(gradebook.getGrade("Sven", "Fritter Part 1"), 0);
});

QUnit.test("Test gradebook errors", function(assert) {
  var gradebook = Gradebook();
  assert.raises(function () {
    gradebook.addStudent("");
  });
  assert.raises(function () {
    gradebook.addAssignment("");
  });
  assert.raises(function () {
    gradebook.getGrade("George", "Prefix Match");
  });
  gradebook.addStudent("Sven");
  gradebook.addAssignment("JavaScript Warm-Up");
  gradebook.setGrade("Sven", "JavaScript Warm-Up", 0);
  assert.raises(function () {
    gradebook.setGrade("Sven2", "JavaScript Warm-Up", 0);
  });
  assert.raises(function () {
    gradebook.setGrade("Sven", "JavaScript Warm-Up2", 0);
  });
  assert.raises(function () {
    gradebook.setGrade("Sven", "JavaScript Warm-Up", NaN);
  });
  // Both OK.
  gradebook.setGrade("Sven", "JavaScript Warm-Up", -1);
  gradebook.setGrade("Sven", "JavaScript Warm-Up", 105);
});


