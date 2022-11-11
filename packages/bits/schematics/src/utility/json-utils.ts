// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

/*****************************************************************
 *
 * This file consists of json utility functions recovered from deletions in the angular-cli repo
 * https://github.com/angular/angular-cli/commit/621f15aa187a2112a71d24a182e20174759fc23c
 *
 *****************************************************************/

import { JsonValue } from "@angular-devkit/core";
import {
    JsonAstArray,
    JsonAstKeyValue,
    JsonAstNode,
    JsonAstObject,
} from "@angular-devkit/core/src/json/parser_ast";
import { UpdateRecorder } from "@angular-devkit/schematics";

function _stringifyContent(value: JsonValue, indentStr: string): string {
    return JSON.stringify(value, null, 2).replace(/\n/g, indentStr);
}

function _buildIndent(count: number): string {
    return count ? "\n" + " ".repeat(count) : "";
}

export function findPropertyInAstObject(
    node: JsonAstObject,
    propertyName: string
): JsonAstNode | null {
    let maybeNode: JsonAstNode | null = null;
    for (const property of node.properties) {
        if (property.key.value === propertyName) {
            maybeNode = property.value;
        }
    }

    return maybeNode;
}

export function appendValueInAstArray(
    recorder: UpdateRecorder,
    node: JsonAstArray,
    inputValue: JsonValue,
    indent = 4
): void {
    let indentStr = _buildIndent(indent);
    let index = node.start.offset + 1;
    // tslint:disable-next-line: no-any
    let newNodes: any[] | undefined;

    if (node.elements.length > 0) {
        // Insert comma.
        const { end } = node.elements[node.elements.length - 1];
        const isClosingOnSameLine = node.end.offset - end.offset === 1;

        if (isClosingOnSameLine && indent) {
            // Reformat the entire array
            recorder.remove(
                node.start.offset,
                node.end.offset - node.start.offset
            );
            newNodes = [...node.elements.map(({ value }) => value), inputValue];
            index = node.start.offset;
            // In case we are generating the entire node we need to reduce the spacing as
            // otherwise we'd end up having incorrect double spacing
            indent = indent - 2;
            indentStr = _buildIndent(indent);
        } else {
            recorder.insertRight(end.offset, ",");
            index = end.offset;
        }
    }

    recorder.insertRight(
        index,
        (newNodes ? "" : indentStr) +
            _stringifyContent(newNodes || inputValue, indentStr) +
            (node.elements.length === 0 && indent
                ? indentStr.substr(0, -indent) + "\n"
                : "")
    );
}

export function appendPropertyInAstObject(
    recorder: UpdateRecorder,
    node: JsonAstObject,
    propertyName: string,
    value: JsonValue,
    indent: number
): void {
    const indentStr = _buildIndent(indent);
    let index = node.start.offset + 1;
    if (node.properties.length > 0) {
        // Insert comma.
        const last = node.properties[node.properties.length - 1];
        const { text, end } = last;
        const commaIndex = text.endsWith("\n") ? end.offset - 1 : end.offset;
        recorder.insertRight(commaIndex, ",");
        index = end.offset;
    }
    const content = _stringifyContent(value, indentStr);
    recorder.insertRight(
        index,
        (node.properties.length === 0 && indent ? "\n" : "") +
            " ".repeat(indent) +
            `"${propertyName}":${indent ? " " : ""}${content}` +
            indentStr.slice(0, -indent)
    );
}

export function insertPropertyInAstObjectInOrder(
    recorder: UpdateRecorder,
    node: JsonAstObject,
    propertyName: string,
    value: JsonValue,
    indent: number
): void {
    if (node.properties.length === 0) {
        appendPropertyInAstObject(recorder, node, propertyName, value, indent);

        return;
    }

    // Find insertion info.
    let insertAfterProp: JsonAstKeyValue | null = null;
    let prev: JsonAstKeyValue | null = null;
    let isLastProp = false;
    const last = node.properties[node.properties.length - 1];
    for (const prop of node.properties) {
        if (prop.key.value > propertyName) {
            if (prev) {
                insertAfterProp = prev;
            }
            break;
        }
        if (prop === last) {
            isLastProp = true;
            insertAfterProp = last;
        }
        prev = prop;
    }

    if (isLastProp) {
        appendPropertyInAstObject(recorder, node, propertyName, value, indent);

        return;
    }

    const indentStr = _buildIndent(indent);
    const insertIndex =
        insertAfterProp === null
            ? node.start.offset + 1
            : insertAfterProp.end.offset + 1;
    const content = _stringifyContent(value, indentStr);
    recorder.insertRight(
        insertIndex,
        indentStr + `"${propertyName}":${indent ? " " : ""}${content}` + ","
    );
}
