/**
 * Create a Gradebook object. A Gradebook contains grades by students and
 * assignments.
 * @constructor
 */
Gradebook = function() {
  /* 6.170's prefered constructor idiom (does not require use of the "new"
  keyword). */
  var that = Object.create(Gradebook.prototype);

  // Keys are student names, values are always true. 
  var students = {};
  // Keys are assignments, values are maps from student names to grades
  var assignments = {};

  var subscribers = [];
  /**
   * Subscribe to changes to this object.
   * @param subscriber a function that is called whenever the Gradebook is
            changed
   */
  that.subscribe = function(subscriber) {
    subscribers.push(subscriber);
  };
  var publishChanges = function() {
    var i;
    for (i = 0; i < subscribers.length; i++)
      subscribers[i]();
  };

  var checkStringArgument = function(obj) {
    if ($.type(obj) !== "string" || obj.length === 0)
      throw new Error("Expected a non-empty string argument");
  };

  var checkKey = function(map, key) {
    checkStringArgument(key);
    if (!map.hasOwnProperty(key))
      throw new Error("No entry " + key);
  };

  /**
   * Add a student.
   *
   * @param {String} student the name of the student
   */
  that.addStudent = function(student) {
    checkStringArgument(student);
    students[student] = true;
    publishChanges();
  };

  /**
   * Add an assignment.
   *
   * @param {String} assignment the name of the assignment
   */
  that.addAssignment = function(assignment) {
    checkStringArgument(assignment);
    assignments[assignment] = {};
    publishChanges();
  };

  /**
   * Set the grade of a student for one assignment.
   *
   * @param {String} student the name of the student
   * @param {String} assignment the name of the assignment
   * @param {Number} grade the grade to set
   */
  that.setGrade = function(student, assignment, grade) {
    checkKey(students, student);
    checkKey(assignments, assignment);
    if ($.type(grade) !== "number" || !isFinite(grade))
      throw new Error("Expected a numeric grade");
    assignments[assignment][student] = grade;
    // break by not publishing changes
    // publishChanges();
  };

  /**
   * Get the grade of a student for one assignment.
   * @param {String} student the name of the student
   * @param {String} assignment the name of the assignment
   */
  that.getGrade = function(student, assignment) {
    checkKey(students, student);
    checkKey(assignments, assignment);
    var ret = assignments[assignment][student];
    return ret === undefined ? 0 : ret;
  };

  /**
   * Get an array of students.
   */
  that.getStudents = function() {
    return Object.keys(students);
  }

  /**
   * Get an array of assignments.
   */
  that.getAssignments = function() {
    return Object.keys(assignments);
  }

  Object.freeze(that);
  return that;
}

