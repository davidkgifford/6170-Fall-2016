/**
 * Install a GradeWidget in the specified DOM container. A GradeWidget is a user
 * interface for editing Gradebook data.
 *
 * @param domContainer a jQuery wrapper around a single empty div element to
 *        install the GradeWidget in.
 * @param {Gradebook} gradebook the Gradebook object to use as a model for the
 *        data being displayed and edited by this GradeWidget.
 * @param {boolean} byAssignment if true, show grades by assignment, otherwise,
 *        show them by student.
 */
GradeWidget_install =
    function(domContainer, gradebook, byAssignment)
{
  var getHeading = function() {
    return byAssignment ? "Grades by Assignment" : "Grades by Student";
  }
  var getDropdownChoices = function() {
    return byAssignment ? gradebook.getAssignments() : gradebook.getStudents();
  }
  var getRowKeys = function() {
    return byAssignment ? gradebook.getStudents() : gradebook.getAssignments();
  }
  var getGrade = function(dropdownValue, rowKey) {
    return byAssignment
      ? gradebook.getGrade(rowKey, dropdownValue)
      : gradebook.getGrade(dropdownValue, rowKey);
  }
  var setGrade = function(dropdownValue, rowKey, newGrade) {
    if (byAssignment) {
      gradebook.setGrade(rowKey, dropdownValue, parseInt(newGrade));
    } else {
      gradebook.setGrade(dropdownValue, rowKey, parseInt(newGrade));
    }
  }

  var dropdownElm = $("<select>");
  var tableElm = $("<table>");
  $.each(getDropdownChoices(), function (index, value) {
    dropdownElm.append($("<option>", { "value": value, text: value }));
  });
  domContainer.append($("<h2>", { text: getHeading() }));
  domContainer.append(dropdownElm);
  domContainer.append(tableElm);
  var gradeInputElm = $("<input type='number'>");
  var currentlyEditedRowKey = null;
  var acceptCurrentEdit = function() {
    if (currentlyEditedRowKey !== null) {
      var student = currentlyEditedRowKey;
      currentlyEditedRowKey = null;
      var assignment = dropdownElm.val();
      var gradeInput = gradeInputElm.val();
      if (gradeInput.length > 0) {
        setGrade(assignment, student, parseInt(gradeInput));
      }
      rebuild_table();
    }
  };
  gradeInputElm.keydown(function (evt) {
    // Enter or tab keys.
    if (evt.keyCode === 13 || evt.keyCode === 9) {
      // Avoid the default focus-traversing behavior of the tab key.
      evt.preventDefault();
      acceptCurrentEdit();
    }
  });

  var rebuild_table = function() {
    /* jQuery will automatically detach any listeners when an element is removed
    from the DOM. Use detach() to remove gradeInputElm without removing its
    listeners, since we'll be reusing it. See
    http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory . */
    gradeInputElm.detach();
    var newTableElm = $("<table class='GradeWidget'>");
    var dropdownValue = dropdownElm.val();
    var total = 0, N = 0;
    if (dropdownValue.length > 0) {
      $.each(getRowKeys(), function (index, rowKey) {
        var grade = getGrade(dropdownValue, rowKey);
        var tableRow = $("<tr>");
        tableRow.append($("<td>", { text: rowKey }));
        var gradeCell = $("<td>");
        if (rowKey !== currentlyEditedRowKey) {
          var gradeElm = $("<a>", { text: grade, href: "#" });
          gradeCell.append(gradeElm);
          gradeCell.click(function() {
            acceptCurrentEdit();
            currentlyEditedRowKey = rowKey;
            rebuild_table();
            if (gradeInputElm !== null) {
              gradeInputElm.select();
              gradeInputElm.focus();
            }
          });
        } else {
          gradeCell.append(gradeInputElm);
          gradeInputElm.val(grade);
        }
        tableRow.append(gradeCell);
        newTableElm.append(tableRow);
        total += grade; N++;
      });
      newTableElm.append($("<tr class='avg'><td>Average</td><td>" +
        (total / N).toFixed(0) + "</td></tr>"));
    }
    /* Replacing the entire DOM container with a new element every time a single
    change avoids convoluted update logic, but can disturb UI state such as
    scroll position, tooltips, keyboard focus etc. Various client libraries
    exist that avoid such problems (React, virtual-dom, Knockout etc.). */
    tableElm.replaceWith(newTableElm);
    tableElm = newTableElm;
  }

  rebuild_table();
  dropdownElm.change(rebuild_table);

  gradebook.subscribe(function() {
    acceptCurrentEdit();
    rebuild_table();
    // Ideally we should also update the dropdown here.
  });
}

